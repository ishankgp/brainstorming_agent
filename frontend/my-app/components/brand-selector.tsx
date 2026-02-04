"use client"

import { useState } from "react"
import { Building2, FileText, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { BRANDS, BRIEF_FORMATS, getBriefTemplate } from "@/lib/brief-templates"

interface BrandSelectorProps {
  onBriefSelected: (content: string) => void
}

export function BrandSelector({ onBriefSelected }: BrandSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(true)

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId)
    setSelectedFormat("") // Reset format when brand changes
  }

  const handleFormatChange = (formatId: string) => {
    setSelectedFormat(formatId)
  }

  const handleLoadBrief = () => {
    if (selectedBrand && selectedFormat) {
      const content = getBriefTemplate(selectedBrand, selectedFormat)
      if (content) {
        onBriefSelected(content)
        setIsExpanded(false)
      }
    }
  }

  const selectedBrandData = BRANDS.find((b) => b.id === selectedBrand)
  const selectedFormatData = BRIEF_FORMATS.find((f) => f.id === selectedFormat)

  const canLoadBrief = selectedBrand && selectedFormat

  return (
    <div className="w-full mb-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Header - Always visible */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Brand & Brief Selection</p>
              <p className="text-sm text-muted-foreground">
                {selectedBrandData && selectedFormatData
                  ? `${selectedBrandData.name} - ${selectedFormatData.name}`
                  : "Select a brand and brief format to get started"}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Expandable Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[400px]" : "max-h-0"
          )}
        >
          <div className="border-t border-border p-4 space-y-4">
            {/* Brand Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Brand
              </label>
              <Select value={selectedBrand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a brand..." />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{brand.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBrandData && (
                <p className="text-xs text-muted-foreground pl-1">
                  {selectedBrandData.description}
                </p>
              )}
            </div>

            {/* Brief Format Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Brief Format
              </label>
              <Select
                value={selectedFormat}
                onValueChange={handleFormatChange}
                disabled={!selectedBrand}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedBrand
                        ? "Choose a brief format..."
                        : "Select a brand first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {BRIEF_FORMATS.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{format.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFormatData && (
                <p className="text-xs text-muted-foreground pl-1">
                  {selectedFormatData.description}
                </p>
              )}
            </div>

            {/* Selection Summary */}
            {canLoadBrief && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Ready to load brief
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedBrandData?.name} - {selectedFormatData?.name} brief
                      template will be loaded into the editor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Load Button */}
            <Button
              onClick={handleLoadBrief}
              disabled={!canLoadBrief}
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              Load Marketing Brief
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
