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
    <div className="w-full space-y-14">
      <div className="text-center space-y-5">
        <h2 className="text-5xl md:text-6xl font-light text-foreground tracking-tight leading-tight">
          Generate Challenge<br />Statements
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
          Select a brand and brief format, or paste your own marketing brief
        </p>
      </div>

      {/* Brand & Brief Format Selector */}
      <div className="mt-8">
        <BrandSelector onBriefSelected={handleBriefSelected} />
      </div>

      <div
        className={cn(
          "relative rounded-xl border transition-all duration-300",
          isDragging ? "border-primary/60 bg-primary/5" : "border-border/40 bg-card/30",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileName && (
          <div className="flex items-center gap-3 border-b border-border/40 px-6 py-3 text-sm">
            <FileText className="h-4 w-4 text-primary/70" />
            <span className="text-foreground/80">{fileName}</span>
            <button
              onClick={clearFile}
              className="ml-auto rounded p-1 hover:bg-muted/50 transition-colors"
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
          className="min-h-80 resize-none border-0 bg-transparent text-base font-light focus-visible:ring-0 px-6 py-6"
        />

        <div className="flex items-center justify-between border-t border-border/40 px-6 py-4">
          <div className="flex items-center gap-4">
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
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
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
      <div className="rounded-xl border border-border/40 bg-card/40 transition-all duration-300">
        <div className="flex w-full items-center justify-between p-6">
          <div
            className="flex flex-1 items-center gap-5 cursor-pointer transition-opacity hover:opacity-70"
            onClick={() => setShowResearch(!showResearch)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary/70" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">Research Library</p>
              <p className="text-xs text-muted-foreground">
                {researchDocuments.length} documents available
                {selectedResearch.length > 0 && ` • ${selectedResearch.length} selected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {researchDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <Switch
                  id="include-research"
                  checked={includeResearch}
                  onCheckedChange={setIncludeResearch}
                />
                <Label htmlFor="include-research" className="text-sm cursor-pointer font-light">
                  Include in analysis
                </Label>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowResearch(!showResearch)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label={showResearch ? "Collapse research library" : "Expand research library"}
            >
              {showResearch ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground/60" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground/60" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            showResearch ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="border-t border-border/40 p-6 space-y-4">
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
        <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/25 px-5 py-4">
          <FolderOpen className="h-4 w-4 text-primary/70 shrink-0" />
          <span className="text-sm text-foreground/80 font-light">
            {selectedResearch.length} research document{selectedResearch.length !== 1 ? "s" : ""} will be used to inform challenge statement generation and evaluation
          </span>
        </div>
      )}

      <div className="pt-4">
        <Button
          onClick={() => onGenerate(includeResearch && selectedResearch.length > 0)}
          disabled={!canGenerate || isLoading}
          size="lg"
          className="w-full gap-2 text-base font-medium"
        >
          <Sparkles className={isLoading ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
          {isLoading ? "Analyzing Brief..." : "Generate Challenge Statements"}
        </Button>
      </div>

      {!canGenerate && value.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Please provide at least 50 characters for meaningful analysis
        </p>
      )}
    </div>
  )
}
