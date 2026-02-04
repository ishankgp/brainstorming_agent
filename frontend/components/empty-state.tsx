"use client"

import { FileText, Sparkles, ArrowRight } from "lucide-react"

export function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl py-24 text-center space-y-10">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/8 border border-primary/20">
        <FileText className="h-12 w-12 text-primary/70" />
      </div>
      
      <div className="space-y-5">
        <h3 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
          Start with your marketing brief
        </h3>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
          Paste or upload your marketing brief above. Our AI will analyze it against 12 proven challenge formats to generate strategic problem statements.
        </p>
      </div>

      <div className="pt-8 space-y-8">
        <p className="text-xs font-light text-muted-foreground uppercase tracking-widest">How it works</p>
        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 border border-border/40 px-5 py-3 font-light text-foreground">
            <FileText className="h-4 w-4 text-primary/70" />
            <span>Brief</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground/60 shrink-0 hidden sm:block" />
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 border border-border/40 px-5 py-3 font-light text-foreground">
            <Sparkles className="h-4 w-4 text-primary/70" />
            <span>AI Analysis</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground/60 shrink-0 hidden sm:block" />
          <div className="flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/30 px-5 py-3 font-light text-primary/80">
            <span>Challenges</span>
          </div>
        </div>
      </div>
    </div>
  )
}
