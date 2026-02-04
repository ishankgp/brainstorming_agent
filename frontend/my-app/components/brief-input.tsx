"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ResearchLibrary } from "./research-library"
import { BrandSelector } from "./brand-selector"
import { cn } from "@/lib/utils"
import type { ResearchDocument } from "@/lib/types"

interface BriefInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: (includeResearch: boolean) => void
  isLoading: boolean
  researchDocuments: ResearchDocument[]
  selectedResearch: string[]
  onToggleResearch: (docId: string) => void
  onSelectAllResearch: () => void
  onClearAllResearch: () => void
  onAddResearchDocument: (doc: ResearchDocument) => void
  onRemoveResearchDocument: (docId: string) => void
}

export function BriefInput({
  value,
  onChange,
  onGenerate,
  isLoading,
  researchDocuments,
  selectedResearch,
  onToggleResearch,
  onSelectAllResearch,
  onClearAllResearch,
  onAddResearchDocument,
  onRemoveResearchDocument,
}: BriefInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [showResearch, setShowResearch] = useState(false)
  const [includeResearch, setIncludeResearch] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text()
      onChange(text)
      setFileName(file.name)
    } else {
      // For PDF/DOCX, we'd need actual parsing - simulating with placeholder
      setFileName(file.name)
      onChange(`[Content from ${file.name}]\n\nNote: In production, this would parse the actual document content.`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const clearFile = () => {
    setFileName(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const canGenerate = value.trim().length > 50

  const handleBriefSelected = (content: string) => {
    onChange(content)
    setFileName(null)
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Generate Challenge Statements
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select a brand and brief format, or paste your own marketing brief
        </p>
      </div>

      {/* Brand & Brief Format Selector */}
      <BrandSelector onBriefSelected={handleBriefSelected} />

      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all duration-200",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-card",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileName && (
          <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-foreground">{fileName}</span>
            <button
              onClick={clearFile}
              className="ml-auto rounded p-1 hover:bg-muted"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        )}

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your marketing brief here...

Example: 
Our cardiovascular therapy is launching in Q3 2025. Key competitors include CardioMax and HeartGuard, who currently hold 60% market share combined. Our primary objective is to establish thought leadership among cardiologists while addressing the unmet needs of patients with treatment-resistant hypertension..."
          className="min-h-[200px] resize-none border-0 bg-transparent text-base focus-visible:ring-0"
        />

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
              Upload file
            </label>
            <span className="text-xs text-muted-foreground">
              .txt, .pdf, .docx supported
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {value.length} characters
            </span>
          </div>
        </div>
      </div>

      {/* Research Library Section */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex w-full items-center justify-between p-4">
          <div
            className="flex flex-1 items-center gap-3 cursor-pointer transition-colors hover:opacity-80"
            onClick={() => setShowResearch(!showResearch)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Research Library</p>
              <p className="text-sm text-muted-foreground">
                {researchDocuments.length} documents available
                {selectedResearch.length > 0 && ` • ${selectedResearch.length} selected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {researchDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <Switch
                  id="include-research"
                  checked={includeResearch}
                  onCheckedChange={setIncludeResearch}
                />
                <Label htmlFor="include-research" className="text-sm cursor-pointer">
                  Include in analysis
                </Label>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowResearch(!showResearch)}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label={showResearch ? "Collapse research library" : "Expand research library"}
            >
              {showResearch ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            showResearch ? "max-h-[600px]" : "max-h-0"
          )}
        >
          <div className="border-t border-border p-4">
            <ResearchLibrary
              documents={researchDocuments}
              selectedDocuments={selectedResearch}
              onToggleDocument={onToggleResearch}
              onSelectAll={onSelectAllResearch}
              onClearAll={onClearAllResearch}
              onAddDocument={onAddResearchDocument}
              onRemoveDocument={onRemoveResearchDocument}
            />
          </div>
        </div>
      </div>

      {/* Include research indicator */}
      {includeResearch && selectedResearch.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <FolderOpen className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">
            {selectedResearch.length} research document{selectedResearch.length !== 1 ? "s" : ""} will be used to inform challenge statement generation and evaluation
          </span>
        </div>
      )}

      <Button
        onClick={() => onGenerate(includeResearch && selectedResearch.length > 0)}
        disabled={!canGenerate || isLoading}
        size="lg"
        className="w-full gap-2 text-base"
      >
        <Sparkles className="h-5 w-5" />
        {isLoading ? "Analyzing Brief..." : "Generate Challenge Statements"}
      </Button>

      {!canGenerate && value.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Please provide at least 50 characters for meaningful analysis
        </p>
      )}
    </div>
  )
}
