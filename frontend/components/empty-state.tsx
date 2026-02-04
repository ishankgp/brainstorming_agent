"use client"

import { FileText, Sparkles, ArrowRight } from "lucide-react"

export function EmptyState() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground">
        Start with your marketing brief
      </h3>
      
      <p className="mt-3 text-muted-foreground">
        Paste or upload your marketing brief above. Our AI will analyze it against 12 proven challenge formats to generate strategic problem statements.
      </p>

      <div className="mt-8 space-y-4">
        <p className="text-sm font-medium text-foreground">How it works</p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <FileText className="h-4 w-4" />
            <span>Brief</span>
          </div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Analysis</span>
          </div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary">
            <span>5 Challenges</span>
          </div>
        </div>
      </div>
    </div>
  )
}
