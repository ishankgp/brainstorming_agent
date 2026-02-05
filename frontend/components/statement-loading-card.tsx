"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatementLoadingCardProps {
    index: number
    logs?: string[]
}

export function StatementLoadingCard({ index }: StatementLoadingCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-700 border-border/40 bg-card/20 shadow-sm">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />

            <CardContent className="p-8 sm:p-10">
                <div className="flex items-start gap-5 sm:gap-6">
                    {/* Index Skeleton */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 border border-primary/10 animate-pulse">
                        <span className="text-xs text-muted-foreground/50">{index + 1}</span>
                    </div>

                    <div className="flex-1 space-y-5">
                        {/* Header Skeleton */}
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-4 w-4 text-primary/40 animate-pulse" />
                            <div className="h-4 w-32 rounded bg-muted/40 animate-pulse" />
                        </div>

                        {/* Text Block Skeletons */}
                        <div className="space-y-3 pt-1">
                            <div className="h-4 w-3/4 rounded bg-muted/30 animate-pulse" />
                            <div className="h-4 w-full rounded bg-muted/20 animate-pulse delay-75" />
                            <div className="h-4 w-5/6 rounded bg-muted/20 animate-pulse delay-150" />
                        </div>

                        {/* Metadata Skeletons */}
                        <div className="flex flex-wrap items-center gap-3 pt-3">
                            <div className="h-5 w-20 rounded-full bg-muted/20 animate-pulse" />
                            <div className="h-4 w-24 rounded bg-muted/10 animate-pulse delay-300" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
