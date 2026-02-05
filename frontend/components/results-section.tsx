import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  ChevronUp,
  Brain,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Terminal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatementCard } from "./statement-card"
import { StatementLoadingCard } from "./statement-loading-card"
import { AgentStatus } from "./agent-status"
import { DEFAULT_FORMATS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { GenerationResult, ChallengeFormat } from "@/lib/types"

interface ResultsSectionProps {
  result: GenerationResult
  formats: ChallengeFormat[]
  onReset: () => void
  briefText: string
  includeResearch: boolean
  status?: "idle" | "loading" | "success" | "error"
  currentStep?: string
  logs?: string[]
}

export function ResultsSection({
  result,
  formats,
  onReset,
  briefText,
  includeResearch,
  status = "idle",
  currentStep,
  logs = []
}: ResultsSectionProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [localResult, setLocalResult] = useState<GenerationResult>(result)
  const resultsStartRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to results on initial load/activation
  useEffect(() => {
    if (status === "loading" || (result && result.challenge_statements.length > 0)) {
      // Small delay to ensure render
      setTimeout(() => {
        resultsStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [status, result])

  // Sync with streaming updates from parent, but preserve local edits
  useEffect(() => {
    setLocalResult((prev) => {
      // (Merge logic unchanged)
      const existingMap = new Map(prev.challenge_statements.map((s) => [s.id, s]))
      const mergedStatements = result.challenge_statements.map((newStmt) => {
        const existing = existingMap.get(newStmt.id)
        if (existing) return existing
        return newStmt
      })
      return { ...result, challenge_statements: mergedStatements }
    })
  }, [result])

  // (Sync logic for diagnostic summary appearing)
  useEffect(() => {
    if (result.diagnostic_summary) {
      setShowDiagnostic(true)
    }
  }, [result.diagnostic_summary])


  const handleUpdateStatement = (statementId: number, newText: string, newEvaluation: any) => {
    setLocalResult((prev) => ({
      ...prev,
      challenge_statements: prev.challenge_statements.map((stmt) =>
        stmt.id === statementId
          ? { ...stmt, text: newText, evaluation: newEvaluation, selected_format: newEvaluation?.detected_format_id || stmt.selected_format }
          : stmt
      ),
    }))
  }

  // Calculate overall evaluation stats
  const evalStats = localResult.challenge_statements.reduce(
    (acc, stmt) => {
      if (stmt.evaluation) {
        if (stmt.evaluation.recommendation === "proceed") acc.proceed++
        else if (stmt.evaluation.recommendation === "revise") acc.revise++
        else acc.reject++
      }
      return acc
    },
    { proceed: 0, revise: 0, reject: 0 }
  )

  const isScanning = status === "loading" && !result.diagnostic_summary

  return (
    <div className="w-full space-y-14" ref={resultsStartRef}>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
            Challenge Statements
          </h2>
          <p className="text-base text-muted-foreground font-light max-w-xl">
            {status === 'loading'
              ? "Agent is analyzing your brief and strategizing..."
              : `${localResult.challenge_statements.length} statements generated from your brief`
            }
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          New Brief
        </Button>
      </div>

      {/* Evaluation Summary - Only show if we have results */}
      {localResult.challenge_statements.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200/40 bg-emerald-50/40 px-5 py-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600/80 shrink-0" />
            <span className="text-sm font-light text-emerald-700">
              {evalStats.proceed} Proceed
            </span>
          </div>
          {/* ... (Other badges same as before, omitted for brevity if unchanged logic, but including full block for clarity) */}
          {evalStats.revise > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200/40 bg-amber-50/40 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-amber-500/70" />
              <span className="text-sm font-light text-amber-700">
                {evalStats.revise} Revise
              </span>
            </div>
          )}
          {evalStats.reject > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200/40 bg-red-50/40 px-5 py-3">
              <XCircle className="h-5 w-5 text-red-600/80 shrink-0" />
              <span className="text-sm font-light text-red-700">
                {evalStats.reject} Reject
              </span>
            </div>
          )}
        </div>
      )}

      {/* DIAGNOSTIC SECTION (Dual Mode) */}

      {/* Mode A: Live Scanning (AgentStatus) */}
      {isScanning && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">System Diagnostic & Planning</span>
          </div>
          <AgentStatus logs={logs} currentStep={currentStep || "Initializing"} status={status} />
        </div>
      )}

      {/* Mode B: Completed Diagnostic (Accordion) */}
      {(result.diagnostic_summary && !isScanning) && (
        <div className="rounded-xl border border-border/40 bg-card/40 transition-all duration-300">
          <button
            type="button"
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="flex w-full items-center justify-between p-7 text-left transition-colors hover:bg-muted/20"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/8 border border-accent/20">
                <Brain className="h-4 w-4 text-accent/70" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground text-sm">
                  Diagnostic Decision Path
                </p>
                <p className="text-xs text-muted-foreground font-light">
                  View the agent's reasoning through the diagnostic tree
                </p>
              </div>
            </div>
            {showDiagnostic ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              showDiagnostic ? "max-h-[800px]" : "max-h-0"
            )}
          >
            <div className="border-t border-border p-4 space-y-4">
              {/* (Diagnostic Content - Same as before) */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm text-foreground">{localResult.diagnostic_summary}</p>
              </div>

              {/* Diagnostic Path Steps */}
              {localResult.diagnostic_path && localResult.diagnostic_path.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Decision Tree Path</p>
                  <div className="space-y-2">
                    {localResult.diagnostic_path.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{idx + 1}</div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-foreground">{step.question}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={step.answer === "yes" ? "default" : "secondary"} className={cn("text-xs", step.answer === "yes" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{step.answer.toUpperCase()}</Badge>
                            <span className="text-xs text-muted-foreground">{step.reasoning}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statement Cards & Loading State */}
      <div className="space-y-7 mt-12">
        {localResult.challenge_statements.map((statement, index) => (
          <StatementCard
            key={statement.id}
            statement={statement}
            index={index}
            formats={formats}
            briefText={briefText}
            includeResearch={includeResearch}
            onUpdateStatement={handleUpdateStatement}
          />
        ))}

        {/* Inline Loading Card: Shown when status is loading */}
        {status === "loading" && !isScanning && (
          <StatementLoadingCard
            index={localResult.challenge_statements.length}
            logs={logs}
          />
        )}
      </div>
    </div>
  )
}
