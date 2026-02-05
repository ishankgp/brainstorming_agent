"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
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
} from "@/lib/mock-data"
import type {
  GenerationResult,
  ChallengeFormat,
  DiagnosticRule,
  ResearchDocument,
  ChallengeStatement,
} from "@/lib/types"

type AppState = "idle" | "loading" | "success" | "error"

// Brainstorm Agent main component
function BrainstormAgentContent() {
  // Global Store State
  const {
    briefText, setBriefText,
    appStatus, setAppStatus,
    result, setResult,
    error, setError,
    selectedResearch, setSelectedResearch,
    lastIncludeResearch, setLastIncludeResearch,
    toggleResearch,
    reset: resetStore
  } = useAppStore()

  // Alias for backward compatibility with existing code
  const appState = appStatus
  const setAppState = setAppStatus

  // Local State (non-persistent UI state)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [formats, setFormats] = useState<ChallengeFormat[]>(DEFAULT_FORMATS)
  const [diagnosticRules, setDiagnosticRules] =
    useState<DiagnosticRule[]>(DEFAULT_DIAGNOSTIC_RULES)

  // Research Library (Fetched Data)
  const [researchDocuments, setResearchDocuments] = useState<ResearchDocument[]>([])

  // Load initial data on mount
  useEffect(() => {
    // 1. Load LocalStorage Settings
    const savedFormats = localStorage.getItem("brainstorm-formats")
    const savedRules = localStorage.getItem("brainstorm-rules")

    if (savedFormats) {
      try {
        setFormats(JSON.parse(savedFormats))
      } catch { }
    }

    if (savedRules) {
      try {
        setDiagnosticRules(JSON.parse(savedRules))
      } catch { }
    }

    // 2. Fetch Research Documents from Backend
    const fetchDocuments = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/research-documents')
        if (res.ok) {
          const data = await res.json()
          setResearchDocuments(data)
        } else {
          console.error("Failed to fetch documents:", res.status)
        }
      } catch (e) {
        console.error("Error loading research documents:", e)
      }
    }

    fetchDocuments()
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
    toggleResearch(docId)
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
    const newSelected = selectedResearch.filter((id) => id !== docId)
    setSelectedResearch(newSelected)
  }

  // Use a ref for the timeout to ensure it persists and handles weird closure issues
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleGenerate = async (includeResearch: boolean) => {
    setLastIncludeResearch(includeResearch)
    setAppState("loading")
    setError(null)
    setResult(null) // Clear previous result
    setLastLogMessage("Initializing AI process...")
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

      // Load model config from local storage
      let modelConfig = null
      try {
        const savedConfig = localStorage.getItem("challenge_model_config")
        if (savedConfig) {
          modelConfig = JSON.parse(savedConfig)
          console.log("⚙️ Using custom model config:", modelConfig)
        }
      } catch (e) {
        console.warn("Failed to load model config", e)
      }

      const response = await fetch('http://localhost:8000/api/generate-challenge-statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brief_text: briefText,
          include_research: includeResearch,
          selected_research_ids: includeResearch ? selectedResearch : null,
          generator_config: modelConfig
        }),
        signal: controller.signal
      })

      // 3. Cleanup timeout immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ API Error:", errorData)
        throw new Error(
          errorData.detail || `API request failed with status ${response.status}`
        )
      }

      if (!response.body) {
        throw new Error("Response body is empty")
      }

      // 4. Handle Streaming Response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      // Initialize result shell so we can start populating
      let currentResult: GenerationResult = {
        challenge_statements: [],
        diagnostic_summary: "",
        diagnostic_path: []
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        // Split by double newline (SSE standard separator for events)
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || "" // Keep incomplete part

        for (const part of parts) {
          if (part.startsWith('data: ')) {
            const jsonStr = part.slice(6).trim()
            if (!jsonStr) continue

            try {
              const event = JSON.parse(jsonStr)
              console.log("📨 Stream event:", event.type)

              if (event.type === 'diagnostic') {
                // Diagnostic complete - show streaming UI immediately
                setLastLogMessage("Diagnostic complete. Generating challenges...")
                currentResult = {
                  ...currentResult,
                  diagnostic_summary: event.data.diagnostic_summary,
                  diagnostic_path: event.data.diagnostic_path
                }
                setResult({ ...currentResult })
                setAppState("success") // Switch to success view to show partial results
              }
              else if (event.type === 'challenge_generation') {
                // New statement arrived (without evaluation yet)
                const newStatement = event.data as ChallengeStatement
                setLastLogMessage(`Generated Format ${newStatement.selected_format}. Evaluating...`)

                // Add to list and sort
                // Check if it already exists (redundancy check)
                const exists = currentResult.challenge_statements.find(s => s.id === newStatement.id)
                if (!exists) {
                  const newStatements = [...currentResult.challenge_statements, newStatement]
                    .sort((a, b) => a.id - b.id)

                  currentResult = {
                    ...currentResult,
                    challenge_statements: newStatements
                  }
                  setResult({ ...currentResult })
                }
              }
              else if (event.type === 'challenge_evaluation') {
                // Evaluation arrived - Update existing statement
                const evalData = event.data as ChallengeStatement
                setLastLogMessage(`Evaluated Format ${evalData.selected_format}.`)

                const updatedStatements = currentResult.challenge_statements.map(s => {
                  if (s.id === evalData.id) {
                    return { ...s, ...evalData } // Merge evaluation data
                  }
                  return s
                })

                currentResult = {
                  ...currentResult,
                  challenge_statements: updatedStatements
                }
                setResult({ ...currentResult })
              }
              else if (event.type === 'challenge_result') {
                // Deprecated but logic kept for compatibility just in case
                // ...
              }
              else if (event.type === 'error') {
                throw new Error(event.message)
              }
              else if (event.type === 'complete') {
                console.log("✅ Stream complete")
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e)
            }
          }
        }
      }

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
    resetStore()
  }

  const handleRetry = () => {
    setError(null)
    handleGenerate(lastIncludeResearch)
  }

  // --- streaming log state ---
  const [lastLogMessage, setLastLogMessage] = useState<string>("")

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenLibrary={() => setIsLibraryOpen(true)} />

      <main className="mx-auto max-w-5xl px-8 py-16 md:py-20 lg:px-8">

        {/* LIVE STATUS BANNER */}
        {(appState === "loading" || (appState === "success" && (result?.challenge_statements?.length || 0) < 5)) && lastLogMessage && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <p className="font-mono text-sm">{lastLogMessage}</p>
          </div>
        )}

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
            briefText={briefText}
            includeResearch={lastIncludeResearch}
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


const BrainstormAgent = dynamic(() => Promise.resolve(BrainstormAgentContent), { ssr: false })
export default BrainstormAgent
