"use client"

import React from "react"

import { useState } from "react"
import {
  FileText,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  BarChart3,
  Users,
  Shield,
  Target,
  Folder,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { ResearchDocument, ResearchDocumentType } from "@/lib/types"

interface ResearchLibraryProps {
  documents: ResearchDocument[]
  selectedDocuments: string[]
  onToggleDocument: (documentId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  onAddDocument: (doc: ResearchDocument) => void
  onRemoveDocument: (documentId: string) => void
}

const DOCUMENT_TYPE_CONFIG: Record<
  ResearchDocumentType,
  { label: string; icon: React.ElementType; color: string }
> = {
  "clinical-trial": {
    label: "Clinical Trial",
    icon: FlaskConical,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  "market-research": {
    label: "Market Research",
    icon: BarChart3,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  "competitor-analysis": {
    label: "Competitor Analysis",
    icon: Target,
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
  regulatory: {
    label: "Regulatory",
    icon: Shield,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  "patient-insights": {
    label: "Patient Insights",
    icon: Users,
    color: "text-pink-600 bg-pink-50 border-pink-200",
  },
  other: {
    label: "Other",
    icon: Folder,
    color: "text-gray-600 bg-gray-50 border-gray-200",
  },
}

export function ResearchLibrary({
  documents,
  selectedDocuments,
  onToggleDocument,
  onSelectAll,
  onClearAll,
  onAddDocument,
  onRemoveDocument,
}: ResearchLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.key_insights.some((insight) =>
        insight.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const allSelected = documents.length > 0 && selectedDocuments.length === documents.length
  const someSelected = selectedDocuments.length > 0 && !allSelected

  const handleSimulatedUpload = () => {
    // In a real app, this would open a file picker
    // For now, we simulate adding a new document
    const newDoc: ResearchDocument = {
      id: `RD${(documents.length + 1).toString().padStart(3, "0")}`,
      name: `New Research Document ${documents.length + 1}`,
      type: "other",
      file_type: "pdf",
      description: "Newly uploaded document - description pending review.",
      key_insights: ["Key insight will be extracted after processing"],
      uploaded_at: new Date().toISOString().split("T")[0],
      size_kb: Math.floor(Math.random() * 5000) + 500,
    }
    onAddDocument(newDoc)
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={allSelected ? onClearAll : onSelectAll}
            className="bg-transparent text-xs"
          >
            {allSelected ? "Clear All" : "Select All"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulatedUpload}
            className="gap-1.5 bg-transparent"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      </div>

      {/* Selection summary */}
      <div className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) {
              const input = el.querySelector("input")
              if (input) input.indeterminate = someSelected
            }
          }}
          onCheckedChange={() => (allSelected ? onClearAll() : onSelectAll())}
        />
        <span className="text-muted-foreground">
          {selectedDocuments.length} of {documents.length} documents selected for
          context
        </span>
      </div>

      {/* Documents list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "No documents match your search"
                : "No research documents uploaded yet"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulatedUpload}
              className="mt-3 gap-1.5 bg-transparent"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Document
            </Button>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const typeConfig = DOCUMENT_TYPE_CONFIG[doc.type]
            const TypeIcon = typeConfig.icon
            const isSelected = selectedDocuments.includes(doc.id)
            const isExpanded = expandedDoc === doc.id

            return (
              <Card
                key={doc.id}
                className={cn(
                  "transition-all duration-200",
                  isSelected && "ring-2 ring-primary/30 bg-primary/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleDocument(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={cn("gap-1 text-xs", typeConfig.color)}
                            >
                              <TypeIcon className="h-3 w-3" />
                              {typeConfig.label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {doc.file_type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(doc.size_kb / 1024).toFixed(1)} MB
                            </span>
                          </div>
                          <h4 className="mt-2 font-medium text-foreground leading-snug">
                            {doc.name}
                          </h4>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveDocument(doc.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Key insights - always visible */}
                      <div className="mt-3">
                        <p className="text-xs font-medium text-foreground mb-2">
                          Key Insights ({doc.key_insights.length})
                        </p>
                        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                          {doc.key_insights.map((insight, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {idx + 1}
                              </span>
                              <span className="text-muted-foreground leading-relaxed">
                                {insight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        Uploaded: {doc.uploaded_at}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
