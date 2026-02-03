"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EVALUATION_DIMENSIONS } from "@/lib/mock-data"
import type { EvaluationResult, DimensionScore } from "@/lib/types"

interface EvaluationPanelProps {
  evaluation: EvaluationResult
  compact?: boolean
}

export function EvaluationPanel({
  evaluation,
  compact = false,
}: EvaluationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRecommendationConfig = () => {
    switch (evaluation.recommendation) {
      case "proceed":
        return {
          label: "Proceed",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconClassName: "text-emerald-600",
        }
      case "revise":
        return {
          label: "Revise",
          icon: AlertTriangle,
          className: "bg-amber-50 text-amber-700 border-amber-200",
          iconClassName: "text-amber-600",
        }
      case "reject":
        return {
          label: "Reject",
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
          iconClassName: "text-red-600",
        }
    }
  }

  const config = getRecommendationConfig()
  const Icon = config.icon

  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-emerald-500"
    if (score >= 3) return "bg-amber-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score === 5) return "Excellent"
    if (score === 4) return "Good"
    if (score === 3) return "Adequate"
    if (score === 2) return "Weak"
    return "Poor"
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            config.className
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", config.iconClassName)} />
          {config.label}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium">{evaluation.weighted_score}%</span>
          <span>weighted score</span>
        </div>
        {!evaluation.passes_non_negotiables && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed: {evaluation.failed_non_negotiables.join(", ")}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
              config.className
            )}
          >
            <Icon className={cn("h-4 w-4", config.iconClassName)} />
            {config.label}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Weighted Score:</span>
              <span className="font-semibold text-foreground">
                {evaluation.weighted_score}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Raw:</span>
              <span className="font-medium text-foreground">
                {evaluation.total_score}/40
              </span>
            </div>
          </div>
          {!evaluation.passes_non_negotiables && (
            <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
              <XCircle className="h-4 w-4" />
              <span>
                Non-negotiable failed: {evaluation.failed_non_negotiables.join(", ")}
              </span>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid gap-3">
            {evaluation.dimension_scores.map((ds) => {
              const dimension = EVALUATION_DIMENSIONS.find(
                (d) => d.id === ds.dimension_id
              )
              if (!dimension) return null

              return (
                <DimensionScoreRow
                  key={ds.dimension_id}
                  dimension={dimension}
                  score={ds}
                  getScoreColor={getScoreColor}
                  getScoreLabel={getScoreLabel}
                />
              )
            })}
          </div>

          {/* Research References */}
          {evaluation.research_references &&
            evaluation.research_references.length > 0 && (
              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">
                  Supporting Research
                </p>
                <div className="space-y-2">
                  {evaluation.research_references.map((ref) => (
                    <div
                      key={ref.document_id}
                      className="flex items-start gap-2 rounded-lg bg-primary/5 p-3"
                    >
                      <FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-foreground">
                          {ref.document_name}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          "{ref.relevant_insight}"
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Relevance:
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                className={cn(
                                  "h-1.5 w-3 rounded-sm mr-0.5",
                                  n <= ref.relevance_score
                                    ? "bg-primary"
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="pt-3 border-t border-border">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                <strong>Non-negotiables:</strong> Audience Truth, Data &
                Evidence Alignment, and Creative Solvability must score 3+ to
                proceed. No amount of clever creative can fix failures in these
                areas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DimensionScoreRowProps {
  dimension: (typeof EVALUATION_DIMENSIONS)[0]
  score: DimensionScore
  getScoreColor: (score: number) => string
  getScoreLabel: (score: number) => string
}

function DimensionScoreRow({
  dimension,
  score,
  getScoreColor,
  getScoreLabel,
}: DimensionScoreRowProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-40 flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {dimension.name}
          </span>
          {dimension.is_non_negotiable && (
            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getScoreColor(score.score))}
              style={{ width: `${(score.score / 5) * 100}%` }}
            />
          </div>
          <div className="w-16 flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              {score.score}
            </span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
          <span
            className={cn(
              "text-xs font-medium w-16",
              score.score >= 4
                ? "text-emerald-600"
                : score.score >= 3
                  ? "text-amber-600"
                  : "text-red-600"
            )}
          >
            {getScoreLabel(score.score)}
          </span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded",
              dimension.weight === "high"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {dimension.weight === "high" ? "High" : "Med"} weight
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-primary hover:underline"
        >
          {showDetails ? "Hide" : "Details"}
        </button>
      </div>

      {showDetails && (
        <div className="ml-40 pl-3 border-l-2 border-muted space-y-2 text-xs">
          <p className="text-muted-foreground italic">{dimension.key_question}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-foreground mb-1">What to check:</p>
              <ul className="space-y-0.5 text-muted-foreground">
                {dimension.what_to_check.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Red flags:</p>
              <ul className="space-y-0.5 text-muted-foreground">
                {dimension.red_flags.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-red-500">!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
