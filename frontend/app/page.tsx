"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { BriefInput } from "@/components/brief-input"
import { ResultsSection } from "@/components/results-section"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { FormatLibrary } from "@/components/format-library"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_FORMATS,
  DEFAULT_DIAGNOSTIC_RULES,
  SAMPLE_RESEARCH_DOCUMENTS,
  SAMPLE_BRIEF,
} from "@/lib/mock-data"
import type {
  GenerationResult,
  ChallengeFormat,
  DiagnosticRule,
  ResearchDocument,
} from "@/lib/types"

type AppState = "idle" | "loading" | "success" | "error"

// Brainstorm Agent main component
export default function BrainstormAgent() {
  // Start with empty brief - users select from brand selector or paste their own
  const [briefText, setBriefText] = useState("")
  const [appState, setAppState] = useState<AppState>("idle")
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [formats, setFormats] = useState<ChallengeFormat[]>(DEFAULT_FORMATS)
  const [diagnosticRules, setDiagnosticRules] =
    useState<DiagnosticRule[]>(DEFAULT_DIAGNOSTIC_RULES)

  // Research Library state
  const [researchDocuments, setResearchDocuments] = useState<ResearchDocument[]>(
    SAMPLE_RESEARCH_DOCUMENTS
  )
  const [selectedResearch, setSelectedResearch] = useState<string[]>([])
  const [lastIncludeResearch, setLastIncludeResearch] = useState<boolean>(false)

  // Load formats from localStorage on mount
  useEffect(() => {
    const savedFormats = localStorage.getItem("brainstorm-formats")
    const savedRules = localStorage.getItem("brainstorm-rules")

    if (savedFormats) {
      try {
        setFormats(JSON.parse(savedFormats))
      } catch {
        // Use defaults if parse fails
      }
    }

    if (savedRules) {
      try {
        setDiagnosticRules(JSON.parse(savedRules))
      } catch {
        // Use defaults if parse fails
      }
    }
  }, [])

  // Save formats to localStorage when updated
  const handleUpdateFormats = (newFormats: ChallengeFormat[]) => {
    setFormats(newFormats)
    localStorage.setItem("brainstorm-formats", JSON.stringify(newFormats))
  }

  const handleUpdateRules = (newRules: DiagnosticRule[]) => {
    setDiagnosticRules(newRules)
    localStorage.setItem("brainstorm-rules", JSON.stringify(newRules))
  }

  // Research library handlers
  const handleToggleResearch = (docId: string) => {
    setSelectedResearch((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAllResearch = () => {
    setSelectedResearch(researchDocuments.map((d) => d.id))
  }

  const handleClearAllResearch = () => {
    setSelectedResearch([])
  }

  const handleAddResearchDocument = (doc: ResearchDocument) => {
    setResearchDocuments((prev) => [...prev, doc])
  }

  const handleRemoveResearchDocument = (docId: string) => {
    setResearchDocuments((prev) => prev.filter((d) => d.id !== docId))
    setSelectedResearch((prev) => prev.filter((id) => id !== docId))
  }

  // Use a ref for the timeout to ensure it persists and handles weird closure issues
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleGenerate = async (includeResearch: boolean) => {
    setLastIncludeResearch(includeResearch)
    setAppState("loading")
    setError(null)
    console.log("🚀 Starting generation request...")

    try {
      // 1. Setup AbortController for 120s timeout
      const controller = new AbortController()

      // Clear any existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        console.warn("⏰ Request timed out! Aborting after 120 seconds...")
        controller.abort()
      }, 120000)

      // 2. Make API call
      console.log("📡 Sending POST to /api/generate-challenge-statements")
      const response = await fetch('http://localhost:8000/api/generate-challenge-statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brief_text: briefText,
          include_research: includeResearch,
          selected_research_ids: includeResearch ? selectedResearch : null
        }),
        signal: controller.signal
      })

      // 3. Cleanup timeout immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      console.log(`📥 Response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ API Error:", errorData)
        throw new Error(
          errorData.detail || `API request failed with status ${response.status}`
        )
      }

      const data = await response.json()
      console.log("✅ Data received:", data)

      // 4. Update state with transformed results
      const result = {
        challenge_statements: data.challenge_statements,
        diagnostic_summary: data.diagnostic_summary,
        diagnostic_path: data.diagnostic_path
      }

      setResult(result)
      setAppState("success")
    } catch (err) {
      // Ensure timeout is cleared on error too
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      console.error("🚨 Generation failed:", err)

      let errorMessage = "An unexpected error occurred"
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "Request timed out after 120 seconds. The model might be busy."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setAppState("error")
    }
  }

  const handleReset = () => {
    setBriefText("")
    setResult(null)
    setAppState("idle")
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    handleGenerate(lastIncludeResearch)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenLibrary={() => setIsLibraryOpen(true)} />

      <main className="mx-auto max-w-5xl px-8 py-16 md:py-20 lg:px-8">
        {/* Input Section - Always visible when not in success state */}
        {appState !== "success" && (
          <BriefInput
            value={briefText}
            onChange={setBriefText}
            onGenerate={handleGenerate}
            isLoading={appState === "loading"}
            researchDocuments={researchDocuments}
            selectedResearch={selectedResearch}
            onToggleResearch={handleToggleResearch}
            onSelectAllResearch={handleSelectAllResearch}
            onClearAllResearch={handleClearAllResearch}
            onAddResearchDocument={handleAddResearchDocument}
            onRemoveResearchDocument={handleRemoveResearchDocument}
          />
        )}

        {/* Empty State */}
        {appState === "idle" && !briefText && <EmptyState />}

        {/* Loading State */}
        {appState === "loading" && <LoadingSkeleton />}

        {/* Error State */}
        {appState === "error" && error && (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-3">
              <Button onClick={handleRetry}>Try Again</Button>
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Success State - Results */}
        {appState === "success" && result && (
          <ResultsSection
            result={result}
            formats={formats}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Format Library Modal */}
      <FormatLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        formats={formats}
        onUpdateFormats={handleUpdateFormats}
        diagnosticRules={diagnosticRules}
        onUpdateRules={handleUpdateRules}
      />
    </div>
  )
}
