import { useEffect, useRef, useState } from "react"
import { Terminal, Activity, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentStatusProps {
    logs: string[]
    currentStep: string
    status: "idle" | "loading" | "success" | "error"
}

export function AgentStatus({ logs, currentStep, status }: AgentStatusProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    if (status === "idle") return null

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="rounded-xl border border-border/50 bg-card/95 shadow-lg backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/30">
                    <div className="flex items-center gap-2.5">
                        <div className={cn(
                            "flex h-2 w-2 rounded-full",
                            status === "loading" ? "bg-amber-500 animate-pulse" :
                                status === "error" ? "bg-red-500" : "bg-emerald-500"
                        )} />
                        <span className="text-xs font-medium font-mono text-muted-foreground uppercase tracking-wider">
                            Agent Activity
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        {status === "loading" && <Sparkles className="h-3 w-3 animate-spin text-amber-500" />}
                        {currentStep}
                    </div>
                </div>

                {/* Terminal Logs */}
                <div
                    ref={scrollRef}
                    className="h-48 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-black/5 dark:bg-black/20"
                >
                    {logs.length === 0 && (
                        <span className="text-muted-foreground opacity-50">Initializing...</span>
                    )}
                    {logs.map((log, i) => (
                        <div key={`${i}-${log.substring(0, 10)}`} className="flex gap-2 text-foreground/80">
                            <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-primary/50" />
                            <span className={cn(
                                "break-words leading-relaxed",
                                log.includes("Error") ? "text-red-500" : "",
                                log.includes("Diagnostic") ? "text-purple-500" : "",
                                log.includes("Generated") ? "text-blue-500" : ""
                            )}>
                                {log}
                            </span>
                        </div>
                    ))}
                    {status === "loading" && (
                        <div className="flex gap-1 items-center text-primary/50 pl-5 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span className="h-1.5 w-1.5 rounded-full bg-current delay-75" />
                            <span className="h-1.5 w-1.5 rounded-full bg-current delay-150" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
