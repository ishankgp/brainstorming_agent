"use client"

import { FileText, Sparkles, ArrowRight } from "lucide-react"

export function EmptyState() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 shadow-sm">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground tracking-tight">
        Start with your marketing brief
      </h3>
      
      <p className="mt-4 text-base text-muted-foreground font-medium leading-relaxed">
        Paste or upload your marketing brief above. Our AI will analyze it against 12 proven challenge formats to generate strategic problem statements.
      </p>

      <div className="mt-10 space-y-5">
        <p className="text-sm font-semibold text-foreground uppercase tracking-wide">How it works</p>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-2.5 font-medium text-foreground shadow-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>Brief</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-2.5 font-medium text-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI Analysis</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2.5 font-medium text-primary shadow-sm">
              <span>Challenges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
