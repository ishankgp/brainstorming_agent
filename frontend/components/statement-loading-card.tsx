"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatementLoadingCardProps {
    index: number
    logs?: string[]
}

export function StatementLoadingCard({ index, logs = [] }: StatementLoadingCardProps) {
    // Get the last few logs to display "live" activity
    const recentLogs = logs.slice(-3)

    return (
        <Card className="group relative overflow-hidden transition-all duration-500 border-primary/20 bg-muted/30 shadow-sm">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />

            <CardContent className="p-10">
                <div className="flex items-start gap-6">
                    {/* Number Circle (Pulsing) */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-primary/30 text-sm font-medium text-primary animate-pulse">
                        {index + 1}
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Header: "Agent Working..." */}
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary/80">Agent Active</span>
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping ml-2" />
                        </div>

                        {/* Terminal Window */}
                        <div className="w-full rounded-md bg-zinc-950 p-4 font-mono text-xs text-green-400/90 shadow-inner border border-zinc-800/50 min-h-[100px] flex flex-col justify-end">
                            {recentLogs.length === 0 ? (
                                <div className="flex items-center gap-2">
                                    <span>&gt; Initializing generator...</span>
                                    <span className="animate-pulse">_</span>
                                </div>
                            ) : (
                                recentLogs.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-zinc-500">&gt;</span>
                                        <span className={cn(
                                            "break-words",
                                            i === recentLogs.length - 1 ? "text-green-400" : "text-green-400/60"
                                        )}>
                                            {log.replace(/^\[.*?\]\s*/, '')}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div className="mt-1 h-3 w-2 bg-green-500/50 animate-pulse" />
                        </div>

                        <p className="text-xs text-muted-foreground text-right italic">
                            Gathering context & drafting strategy...
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
