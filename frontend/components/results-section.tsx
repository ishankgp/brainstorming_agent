"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Brain,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatementCard } from "./statement-card"
import { DEFAULT_FORMATS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { GenerationResult, ChallengeFormat } from "@/lib/types"

interface ResultsSectionProps {
  result: GenerationResult
  formats: ChallengeFormat[]
  onReset: () => void
}

export function ResultsSection({
  result,
  formats,
  onReset,
}: ResultsSectionProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false)

  // Calculate overall evaluation stats
  const evalStats = result.challenge_statements.reduce(
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

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Challenge Statements
          </h2>
          <p className="mt-1 text-muted-foreground">
            {result.challenge_statements.length} statements generated from your
            brief
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 bg-transparent"
        >
          <RotateCcw className="h-4 w-4" />
          New Brief
        </Button>
      </div>

      {/* Evaluation Summary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            {evalStats.proceed} Proceed
          </span>
        </div>
        {evalStats.revise > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {evalStats.revise} Revise
            </span>
          </div>
        )}
        {evalStats.reject > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              {evalStats.reject} Reject
            </span>
          </div>
        )}
      </div>

      {/* Diagnostic Summary Toggle */}
      <div className="rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={() => setShowDiagnostic(!showDiagnostic)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Brain className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Diagnostic Decision Path
              </p>
              <p className="text-sm text-muted-foreground">
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
            {/* Diagnostic Path Steps */}
            {result.diagnostic_path && result.diagnostic_path.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Decision Tree Path
                </p>
                <div className="space-y-2">
                  {result.diagnostic_path.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {step.question}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              step.answer === "yes" ? "default" : "secondary"
                            }
                            className={cn(
                              "text-xs",
                              step.answer === "yes"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {step.answer.toUpperCase()}
                          </Badge>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {step.reasoning}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm text-foreground">{result.diagnostic_summary}</p>
            </div>

            {/* Format Distribution */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Selected Formats
              </p>
              <div className="flex flex-wrap gap-2">
                {result.challenge_statements.map((stmt) => {
                  const format =
                    formats.find((f) => f.id === stmt.selected_format) ||
                    DEFAULT_FORMATS.find((f) => f.id === stmt.selected_format)
                  return (
                    <div
                      key={stmt.id}
                      className="rounded-md bg-card border border-border px-3 py-1.5 text-sm"
                    >
                      <span className="font-medium text-primary">
                        {stmt.selected_format}
                      </span>
                      {format && (
                        <span className="ml-1.5 text-muted-foreground">
                          {format.name}
                        </span>
                      )}
                      {format?.category === "edge-case" && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-[10px] border-amber-300 text-amber-600"
                        >
                          Edge
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statement Cards */}
      <div className="space-y-4">
        {result.challenge_statements.map((statement, index) => (
          <StatementCard
            key={statement.id}
            statement={statement}
            index={index}
            formats={formats}
          />
        ))}
      </div>
    </div>
  )
}
