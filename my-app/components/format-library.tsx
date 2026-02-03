"use client"

import { useState } from "react"
import {
  X,
  Search,
  Edit2,
  Save,
  ChevronDown,
  ChevronUp,
  Code,
  Plus,
  Trash2,
  BookOpen,
  AlertTriangle,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { EVALUATION_DIMENSIONS } from "@/lib/mock-data"
import type { ChallengeFormat, DiagnosticRule } from "@/lib/types"

interface FormatLibraryProps {
  isOpen: boolean
  onClose: () => void
  formats: ChallengeFormat[]
  onUpdateFormats: (formats: ChallengeFormat[]) => void
  diagnosticRules: DiagnosticRule[]
  onUpdateRules: (rules: DiagnosticRule[]) => void
}

export function FormatLibrary({
  isOpen,
  onClose,
  formats,
  onUpdateFormats,
  diagnosticRules,
}: FormatLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingFormat, setEditingFormat] = useState<ChallengeFormat | null>(null)
  const [activeTab, setActiveTab] = useState("formats")

  const coreFormats = formats.filter((f) => f.category === "core")
  const edgeCaseFormats = formats.filter((f) => f.category === "edge-case")

  const filteredFormats = formats.filter(
    (format) =>
      format.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format.format_template.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (format: ChallengeFormat) => {
    setEditingId(format.id)
    setEditingFormat({ ...format })
  }

  const handleSave = () => {
    if (editingFormat) {
      const updatedFormats = formats.map((f) =>
        f.id === editingFormat.id ? editingFormat : f
      )
      onUpdateFormats(updatedFormats)
      setEditingId(null)
      setEditingFormat(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingFormat(null)
  }

  const handleWhenToUseChange = (index: number, value: string) => {
    if (editingFormat) {
      const newWhenToUse = [...editingFormat.when_to_use]
      newWhenToUse[index] = value
      setEditingFormat({ ...editingFormat, when_to_use: newWhenToUse })
    }
  }

  const addWhenToUse = () => {
    if (editingFormat) {
      setEditingFormat({
        ...editingFormat,
        when_to_use: [...editingFormat.when_to_use, ""],
      })
    }
  }

  const removeWhenToUse = (index: number) => {
    if (editingFormat) {
      const newWhenToUse = editingFormat.when_to_use.filter((_, i) => i !== index)
      setEditingFormat({ ...editingFormat, when_to_use: newWhenToUse })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm">
      <div className="relative mx-4 my-8 w-full max-w-5xl rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Challenge Framework Library
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              12 challenge formats, diagnostic decision tree, and evaluation criteria
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border px-6">
            <TabsList className="h-12 w-full justify-start gap-4 rounded-none border-none bg-transparent p-0">
              <TabsTrigger
                value="formats"
                className="relative h-12 rounded-none border-b-2 border-transparent px-1 pb-3 pt-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Challenge Formats ({formats.length})
              </TabsTrigger>
              <TabsTrigger
                value="diagnostic"
                className="relative h-12 rounded-none border-b-2 border-transparent px-1 pb-3 pt-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Code className="mr-2 h-4 w-4" />
                Diagnostic Tree
              </TabsTrigger>
              <TabsTrigger
                value="evaluation"
                className="relative h-12 rounded-none border-b-2 border-transparent px-1 pb-3 pt-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Layers className="mr-2 h-4 w-4" />
                Evaluation Framework
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Formats Tab */}
          <TabsContent value="formats" className="mt-0">
            {/* Search */}
            <div className="border-b border-border px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search formats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Format List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Core Formats */}
              <div className="px-6 py-3 bg-muted/30 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Core Formats
                  <Badge variant="secondary" className="text-xs">
                    {coreFormats.length}
                  </Badge>
                </h3>
              </div>
              <div className="divide-y divide-border">
                {filteredFormats
                  .filter((f) => f.category === "core")
                  .map((format) => (
                    <FormatItem
                      key={format.id}
                      format={format}
                      editingId={editingId}
                      editingFormat={editingFormat}
                      setEditingFormat={setEditingFormat}
                      handleEdit={handleEdit}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                      handleWhenToUseChange={handleWhenToUseChange}
                      addWhenToUse={addWhenToUse}
                      removeWhenToUse={removeWhenToUse}
                    />
                  ))}
              </div>

              {/* Edge Case Formats */}
              <div className="px-6 py-3 bg-amber-50/50 border-y border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Edge-Case Formats (The 10% Most Frameworks Miss)
                  <Badge
                    variant="outline"
                    className="text-xs border-amber-300 text-amber-700"
                  >
                    {edgeCaseFormats.length}
                  </Badge>
                </h3>
              </div>
              <div className="divide-y divide-border">
                {filteredFormats
                  .filter((f) => f.category === "edge-case")
                  .map((format) => (
                    <FormatItem
                      key={format.id}
                      format={format}
                      editingId={editingId}
                      editingFormat={editingFormat}
                      setEditingFormat={setEditingFormat}
                      handleEdit={handleEdit}
                      handleSave={handleSave}
                      handleCancel={handleCancel}
                      handleWhenToUseChange={handleWhenToUseChange}
                      addWhenToUse={addWhenToUse}
                      removeWhenToUse={removeWhenToUse}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Diagnostic Tree Tab */}
          <TabsContent value="diagnostic" className="mt-0">
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Decision Tree: Start Here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask: <strong>What's actually broken?</strong>
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="font-medium text-foreground">
                      Q1: Is the audience already behaving the way we want?
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div className="rounded-md border border-border bg-card p-3">
                        <p className="text-sm font-medium text-emerald-600 mb-1">
                          YES → Path A
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Behavior exists but is at risk
                        </p>
                      </div>
                      <div className="rounded-md border border-border bg-card p-3">
                        <p className="text-sm font-medium text-amber-600 mb-1">
                          NO → Path B
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Behavior is not happening
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-foreground mb-4">
                  Quick Reference: If the problem is...
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {diagnosticRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                    >
                      <Badge variant="outline" className="font-mono shrink-0">
                        {rule.format_id}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {rule.problem}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          → {rule.format_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Path A */}
              <DiagnosticPath
                title="Path A: Behavior Exists (But Is At Risk)"
                color="emerald"
                questions={[
                  {
                    question:
                      "Q2: Is the issue that confidence or commitment is eroding over time?",
                    yes: { format: "F12", name: "Behavior-Maintenance" },
                    no: "Go to Q2a",
                  },
                  {
                    question:
                      "Q2a: Is external pressure (competition, policy, noise) undermining belief?",
                    yes: { format: "F07", name: "Confidence-Building" },
                    no: { format: "F10", name: "Trust-Repair" },
                  },
                ]}
              />

              {/* Path B */}
              <DiagnosticPath
                title="Path B: Behavior Is Not Happening"
                color="amber"
                questions={[
                  {
                    question:
                      "Q3: Does the audience know what to do, but hesitate emotionally or professionally?",
                    yes: { format: "F03", name: "Permission-Giving" },
                    no: "Go to Q4",
                  },
                  {
                    question:
                      "Q4: Is the primary barrier a dominant belief or mental model?",
                    yes: { format: "F02", name: "Reframing" },
                    no: "Go to Q5",
                  },
                  {
                    question:
                      "Q5: Is the audience overwhelmed or paralyzed by complexity?",
                    yes: { format: "F06", name: "Simplification" },
                    no: "Go to Q6",
                  },
                  {
                    question:
                      "Q6: Is the brand's problem that its role is unclear in the journey or decision moment?",
                    yes: { format: "F04", name: "Role-Clarification" },
                    no: "Go to Q7",
                  },
                  {
                    question:
                      "Q7: Is the audience defaulting to the status quo because inaction feels safer than action?",
                    yes: { format: "F09", name: "Risk-of-Inaction" },
                    no: "Go to Q8",
                  },
                  {
                    question:
                      "Q8: Is the category optimizing for the wrong definition of success?",
                    yes: { format: "F08", name: "Redefining-Success" },
                    no: "Go to Q9",
                  },
                  {
                    question:
                      "Q9: Are competitors winning by being louder, broader, or more aggressive — and credibility is the opening?",
                    yes: { format: "F05", name: "Differentiation-Through-Restraint" },
                    no: { format: "F01", name: "Core Mindset-Shift" },
                  },
                ]}
              />
            </div>
          </TabsContent>

          {/* Evaluation Framework Tab */}
          <TabsContent value="evaluation" className="mt-0">
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Evaluation Purpose
                </h3>
                <p className="text-sm text-muted-foreground">
                  Assess whether the selected Challenge is strategically correct,
                  grounded in real insight and data, appropriate for the brand's
                  lifecycle, and can realistically be solved by creative
                  communication.
                </p>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  8 Evaluation Dimensions
                </h3>
                {EVALUATION_DIMENSIONS.map((dim) => (
                  <EvaluationDimensionCard key={dim.id} dimension={dim} />
                ))}
              </div>

              {/* Non-negotiables */}
              <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Non-Negotiables Check
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  A Challenge should <strong>not proceed</strong> if it fails:
                </p>
                <ul className="space-y-2">
                  {EVALUATION_DIMENSIONS.filter((d) => d.is_non_negotiable).map(
                    (dim) => (
                      <li
                        key={dim.id}
                        className="flex items-center gap-2 text-sm text-red-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <strong>{dim.name}</strong>
                      </li>
                    )
                  )}
                </ul>
                <p className="text-xs text-red-600 mt-3 italic">
                  No amount of clever creative can fix failures in these areas.
                </p>
              </div>

              {/* Scoring Guide */}
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Weighted Scoring Guide
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20">
                        High Weight (3x)
                      </Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- Business Relevance</li>
                      <li>- Audience Truth</li>
                      <li>- Insight Strength</li>
                      <li>- Creative Solvability</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Medium Weight (2x)</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- Data Alignment</li>
                      <li>- Lifecycle Fit</li>
                      <li>- Strategic Focus</li>
                      <li>- Longevity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Format Item Component
interface FormatItemProps {
  format: ChallengeFormat
  editingId: string | null
  editingFormat: ChallengeFormat | null
  setEditingFormat: (format: ChallengeFormat | null) => void
  handleEdit: (format: ChallengeFormat) => void
  handleSave: () => void
  handleCancel: () => void
  handleWhenToUseChange: (index: number, value: string) => void
  addWhenToUse: () => void
  removeWhenToUse: (index: number) => void
}

function FormatItem({
  format,
  editingId,
  editingFormat,
  setEditingFormat,
  handleEdit,
  handleSave,
  handleCancel,
  handleWhenToUseChange,
  addWhenToUse,
  removeWhenToUse,
}: FormatItemProps) {
  if (editingId === format.id && editingFormat) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            {format.id}
          </Badge>
          <Input
            value={editingFormat.name}
            onChange={(e) =>
              setEditingFormat({ ...editingFormat, name: e.target.value })
            }
            className="flex-1 font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label>Format Template</Label>
          <Textarea
            value={editingFormat.format_template}
            onChange={(e) =>
              setEditingFormat({
                ...editingFormat,
                format_template: e.target.value,
              })
            }
            rows={2}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Example</Label>
          <Textarea
            value={editingFormat.example}
            onChange={(e) =>
              setEditingFormat({ ...editingFormat, example: e.target.value })
            }
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>When to Use</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={addWhenToUse}
              className="gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {editingFormat.when_to_use.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleWhenToUseChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWhenToUse(index)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-1">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            {format.id}
          </Badge>
          <h3 className="font-semibold text-foreground">{format.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(format)}
          className="gap-1"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
        <p className="text-sm font-mono text-foreground">
          {format.format_template}
        </p>
      </div>

      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Example:
        </p>
        <p className="text-sm italic text-foreground">{format.example}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          When to use:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {format.when_to_use.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// Diagnostic Path Component
interface DiagnosticPathProps {
  title: string
  color: "emerald" | "amber"
  questions: Array<{
    question: string
    yes: { format: string; name: string } | string
    no: { format: string; name: string } | string
  }>
}

function DiagnosticPath({ title, color, questions }: DiagnosticPathProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const borderColor = color === "emerald" ? "border-emerald-200" : "border-amber-200"
  const bgColor = color === "emerald" ? "bg-emerald-50/50" : "bg-amber-50/50"
  const textColor = color === "emerald" ? "text-emerald-700" : "text-amber-700"

  return (
    <div className={cn("rounded-lg border", borderColor, bgColor)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <h3 className={cn("font-semibold", textColor)}>{title}</h3>
        {isExpanded ? (
          <ChevronUp className={cn("h-5 w-5", textColor)} />
        ) : (
          <ChevronDown className={cn("h-5 w-5", textColor)} />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 space-y-3">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="rounded-md border border-border bg-card p-3 space-y-2"
            >
              <p className="text-sm font-medium text-foreground">{q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-emerald-50 p-2 text-xs">
                  <span className="font-medium text-emerald-700">YES → </span>
                  {typeof q.yes === "string" ? (
                    <span className="text-emerald-600">{q.yes}</span>
                  ) : (
                    <span className="text-emerald-600">
                      <strong>{q.yes.format}</strong> {q.yes.name}
                    </span>
                  )}
                </div>
                <div className="rounded bg-muted p-2 text-xs">
                  <span className="font-medium text-muted-foreground">NO → </span>
                  {typeof q.no === "string" ? (
                    <span className="text-muted-foreground">{q.no}</span>
                  ) : (
                    <span className="text-foreground">
                      <strong>{q.no.format}</strong> {q.no.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Evaluation Dimension Card
interface EvaluationDimensionCardProps {
  dimension: (typeof EVALUATION_DIMENSIONS)[0]
}

function EvaluationDimensionCard({ dimension }: EvaluationDimensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            {dimension.id}
          </Badge>
          <span className="font-medium text-foreground">{dimension.name}</span>
          {dimension.is_non_negotiable && (
            <Badge variant="destructive" className="text-xs">
              Non-negotiable
            </Badge>
          )}
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              dimension.weight === "high" && "bg-primary/10 text-primary"
            )}
          >
            {dimension.weight} weight
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium text-foreground mb-1">
              Key Question:
            </p>
            <p className="text-sm italic text-muted-foreground">
              {dimension.key_question}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                What to Check:
              </p>
              <ul className="space-y-1">
                {dimension.what_to_check.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-emerald-500 mt-1">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Red Flags:
              </p>
              <ul className="space-y-1">
                {dimension.red_flags.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-red-500 mt-1">!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
