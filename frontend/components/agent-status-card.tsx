"use client"

import { useState, useEffect } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Loader2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentStatusCardProps {
    logs: string[]
    status: "idle" | "loading" | "success" | "error"
    className?: string
}

export function AgentStatusCard({ logs, status, className }: AgentStatusCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Auto-expand on load
    useEffect(() => {
        if (status === "loading") {
            setIsOpen(true)
        }
    }, [status])

    // Hide if idle and empty
    if (status === "idle" && logs.length === 0) return null

    const lastLog = logs.length > 0 ? logs[logs.length - 1] : "Ready to innovate."

    return (
        <Card className={cn("overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-500", className)}>
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full"
            >
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        {status === "loading" ? (
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <div className="absolute inset-0 animate-pulse rounded-lg bg-primary/20 ring-1 ring-primary/30" />
                            </div>
                        ) : status === "success" ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                <Sparkles className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                                {status === "loading" ? "Agent Active" : status === "success" ? "Mission Complete" : "Agent Ready"}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-md">
                                {status === "loading" ? lastLog : `${logs.length} steps completed`}
                            </span>
                        </div>
                    </div>

                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">Toggle Agent Logs</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="space-y-2">
                    <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                        <div className="font-mono text-xs space-y-3 text-muted-foreground/80 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-border">
                            {logs.map((log, index) => (
                                <div key={index} className="flex gap-3">
                                    <span className="text-muted-foreground/40 shrink-0">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className={cn(
                                        "flex-1 break-words",
                                        index === logs.length - 1 && status === "loading" && "text-primary animate-pulse"
                                    )}>
                                        {log}
                                    </span>
                                </div>
                            ))}
                            {status === "loading" && (
                                <div className="flex gap-3 items-center">
                                    <span className="text-muted-foreground/40">..</span>
                                    <span className="h-2 w-1.5 bg-primary/50 animate-bounce" />
                                </div>
                            )}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
