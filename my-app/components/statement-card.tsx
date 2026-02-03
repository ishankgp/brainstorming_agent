"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Lightbulb, Tag, ClipboardCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { EvaluationPanel } from "./evaluation-panel"
import { DEFAULT_FORMATS } from "@/lib/mock-data"
import type { ChallengeStatement, ChallengeFormat } from "@/lib/types"

interface StatementCardProps {
  statement: ChallengeStatement
  index: number
  formats: ChallengeFormat[]
}

export function StatementCard({ statement, index, formats }: StatementCardProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)

  const format = formats.find((f) => f.id === statement.selected_format) ||
    DEFAULT_FORMATS.find((f) => f.id === statement.selected_format)

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-lg leading-relaxed text-foreground">
              {statement.text}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Tag className="h-3 w-3" />
                {statement.selected_format}
              </Badge>
              {format && (
                <span className="text-sm text-muted-foreground">
                  {format.name}
                </span>
              )}
              {format?.category === "edge-case" && (
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                  Edge Case Format
                </Badge>
              )}
            </div>

            {/* Quick evaluation summary */}
            {statement.evaluation && (
              <EvaluationPanel evaluation={statement.evaluation} compact />
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Lightbulb className="h-4 w-4" />
                {showReasoning ? "Hide reasoning" : "Show reasoning"}
                {showReasoning ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {statement.evaluation && (
                <button
                  type="button"
                  onClick={() => setShowEvaluation(!showEvaluation)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  {showEvaluation ? "Hide evaluation" : "Full evaluation"}
                  {showEvaluation ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>

            {/* Reasoning panel */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                showReasoning ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-3">
                <p className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {statement.reasoning}
                </p>
                {format && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-foreground mb-1">
                      Format Template:
                    </p>
                    <p className="text-xs italic">{format.format_template}</p>
                    <p className="text-xs font-medium text-foreground mt-2 mb-1">
                      When to use:
                    </p>
                    <ul className="text-xs space-y-0.5">
                      {format.when_to_use.map((use, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">-</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation panel */}
            {statement.evaluation && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  showEvaluation ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <EvaluationPanel evaluation={statement.evaluation} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
