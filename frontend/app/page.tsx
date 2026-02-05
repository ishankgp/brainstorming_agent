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
import { useChallengeGenerator } from "@/lib/hooks/use-challenge-generator"
import { AgentStatus } from "@/components/agent-status"
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
    selectedResearch, setSelectedResearch,
    lastIncludeResearch, setLastIncludeResearch,
    toggleResearch,
    reset: resetStore
  } = useAppStore()

  // Local State (non-persistent UI state)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [formats, setFormats] = useState<ChallengeFormat[]>(DEFAULT_FORMATS)
  const [diagnosticRules, setDiagnosticRules] =
    useState<DiagnosticRule[]>(DEFAULT_DIAGNOSTIC_RULES)

  // Research Library (Fetched Data)
  const [researchDocuments, setResearchDocuments] = useState<ResearchDocument[]>([])

  // Custom Hook for Logic
  const {
    generate,
    cancel,
    result,
    status,
    error,
    logs,
    currentStep
  } = useChallengeGenerator()

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

  const handleGenerateWrapper = async (includeResearch: boolean) => {
    setLastIncludeResearch(includeResearch)
    await generate(briefText, includeResearch, selectedResearch)
  }

  const handleReset = () => {
    resetStore()
    cancel() // Ensure any running process is stopped
  }

  const handleRetry = () => {
    handleGenerateWrapper(lastIncludeResearch)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenLibrary={() => setIsLibraryOpen(true)} />

      <main className="mx-auto max-w-5xl px-8 py-16 md:py-20 lg:px-8">

        {/* LIVE AGENT STATUS */}
        <AgentStatus
          logs={logs}
          currentStep={currentStep}
          status={status}
        />

        {/* Input Section - Always visible when not in success state */}
        {status !== "success" && status !== "loading" && (
          <BriefInput
            value={briefText}
            onChange={setBriefText}
            onGenerate={handleGenerateWrapper}
            isLoading={status === "loading"}
            researchDocuments={researchDocuments}
            selectedResearch={selectedResearch}
            onToggleResearch={handleToggleResearch}
            onSelectAllResearch={handleSelectAllResearch}
            onClearAllResearch={handleClearAllResearch}
            onAddResearchDocument={handleAddResearchDocument}
            onRemoveResearchDocument={handleRemoveResearchDocument}
          />
        )}

        {/* Loading Skeleton (now mostly replaced by AgentStatus, but kept for layout structure underneath) */}
        {status === "loading" && (
          <div className="opacity-50 pointer-events-none filter blur-sm transition-all duration-500">
            <LoadingSkeleton />
          </div>
        )}

        {/* Empty State */}
        {status === "idle" && !briefText && <EmptyState />}

        {/* Error State */}
        {status === "error" && error && (
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
        {(status === "success" || (result && result.challenge_statements.length > 0)) && result && (
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
