"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Tag,
  ClipboardCheck,
  Pencil,
  Sparkles,
  Check,
  X,
  ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { EvaluationPanel } from "./evaluation-panel"
import { DEFAULT_FORMATS } from "@/lib/mock-data"
import type { ChallengeStatement, ChallengeFormat, EvaluationResult } from "@/lib/types"

interface StatementCardProps {
  statement: ChallengeStatement
  index: number
  formats: ChallengeFormat[]
  briefText: string
  includeResearch: boolean
  onUpdateStatement: (id: number, newText: string, newEvaluation: EvaluationResult) => void
}

export function StatementCard({
  statement,
  index,
  formats,
  briefText,
  includeResearch,
  onUpdateStatement
}: StatementCardProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [editedText, setEditedText] = useState(statement.text)
  const [comparisonResult, setComparisonResult] = useState<EvaluationResult | null>(null)

  const format = formats.find((f) => f.id === statement.selected_format) ||
    DEFAULT_FORMATS.find((f) => f.id === statement.selected_format)

  // Handlers
  const handleStartEdit = () => {
    setIsEditing(true)
    setEditedText(statement.text)
    setComparisonResult(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedText(statement.text)
    setComparisonResult(null)
  }

  const handleAiRewrite = async () => {
    setIsRewriting(true)
    try {
      const response = await fetch('http://localhost:8000/api/rewrite-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief_text: briefText,
          statement_text: editedText,
          instruction: "Make it more concise and punchy."
        })
      })
      const data = await response.json()
      if (data.text) {
        setEditedText(data.text)
      }
    } catch (err) {
      console.error("Rewrite failed:", err)
    } finally {
      setIsRewriting(false)
    }
  }

  const handleReEvaluate = async () => {
    setIsEvaluating(true)
    try {
      const response = await fetch('http://localhost:8000/api/evaluate-single-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief_text: briefText,
          statement_text: editedText,
          include_research: includeResearch
        })
      })
      const result = await response.json()
      setComparisonResult(result)
    } catch (err) {
      console.error("Evaluation failed:", err)
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleAccept = () => {
    if (comparisonResult) {
      onUpdateStatement(statement.id, editedText, comparisonResult)
      setIsEditing(false)
      setComparisonResult(null)
    }
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/40 bg-card/50">
      <CardContent className="p-10">
        <div className="flex items-start gap-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            {index + 1}
          </div>

          <div className="flex-1 space-y-6">

            {/* Display Mode vs Edit Mode */}
            {!isEditing ? (
              <p className="text-lg leading-relaxed text-foreground font-light">
                {statement.text}
              </p>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="text-lg font-light min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAiRewrite}
                    disabled={isRewriting || isEvaluating}
                  >
                    {isRewriting ? (
                      <Sparkles className="h-3 w-3 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-2" />
                    )}
                    AI Rewrite
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReEvaluate}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? "Evaluating..." : "Evaluate & Compare"}
                  </Button>
                </div>
              </div>
            )}

            {/* Comparison View */}
            {isEditing && comparisonResult && (
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Comparison Result</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="h-8" onClick={handleAccept}>
                      <Check className="h-4 w-4 mr-1" /> Accept New
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Original</p>
                    <div className="p-2 rounded bg-background/50 border">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{statement.evaluation?.weighted_score}%</span>
                        <Badge variant="outline" className="text-[10px]">{statement.selected_format}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{statement.text}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">New Version</p>
                    <div className="p-2 rounded bg-background border border-primary/20">
                      <div className="flex justify-between mb-1">
                        <span className={cn(
                          "font-medium",
                          comparisonResult.weighted_score > (statement.evaluation?.weighted_score || 0)
                            ? "text-emerald-600"
                            : "text-amber-600"
                        )}>
                          {comparisonResult.weighted_score}%
                        </span>
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          {comparisonResult.detected_format_id || "Unknown"}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground line-clamp-2">{editedText}</p>
                    </div>
                  </div>
                </div>

                {/* Format Change Alert */}
                {statement.selected_format !== comparisonResult.detected_format_id && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    <Lightbulb className="h-3 w-3" />
                    <span>Format shifted from <strong>{statement.selected_format}</strong> to <strong>{comparisonResult.detected_format_id}</strong> based on your changes.</span>
                  </div>
                )}
              </div>
            )}

            {/* Metadata & Actions (Hidden when editing to reduce clutter) */}
            {!isEditing && (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="gap-2 font-light">
                    <Tag className="h-3 w-3" />
                    {statement.selected_format}
                  </Badge>
                  {format && (
                    <span className="text-sm text-muted-foreground font-light">
                      {format.name}
                    </span>
                  )}
                  {format?.category === "edge-case" && (
                    <Badge variant="outline" className="text-xs border-amber-300/50 text-amber-700/80 bg-amber-50/50 font-light">
                      Edge Case Format
                    </Badge>
                  )}
                </div>

                {/* Quick evaluation summary */}
                {statement.evaluation && (
                  <EvaluationPanel evaluation={statement.evaluation} compact />
                )}

                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-light w-fit"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showReasoning ? "Hide reasoning" : "Show reasoning"}
                      {showReasoning ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {statement.evaluation && (
                      <button
                        type="button"
                        onClick={() => setShowEvaluation(!showEvaluation)}
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-light w-fit"
                      >
                        <ClipboardCheck className="h-4 w-4" />
                        {showEvaluation ? "Hide evaluation" : "Full evaluation"}
                        {showEvaluation ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-light w-fit"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit & Re-evaluate
                    </button>
                  </div>

                  {/* Reasoning panel */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      showReasoning ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="rounded-lg bg-muted/20 border border-border/30 p-6 text-sm text-muted-foreground space-y-4">
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
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
