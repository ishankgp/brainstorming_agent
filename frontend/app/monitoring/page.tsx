"use client"

import { useEffect, useState, Fragment } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Server, Play, ChevronDown, ChevronRight, Activity, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ChallengeTiming {
    id: number
    position: number
    format: string
    generation_time_ms?: number
    evaluation_time_ms?: number
    gen_model?: string
    gen_input_tokens?: number
    gen_output_tokens?: number
    eval_model?: string
    eval_input_tokens?: number
    eval_output_tokens?: number
}

interface TimingMetrics {
    total_latency_ms: number
    diagnostic_ms: number
    retrieval_ms: number
    generation_avg_ms?: number
}

interface SessionSummary {
    id: string
    brief_preview: string
    created_at: string
    status: string
    statement_count: number
    timing_metrics: TimingMetrics | null
    challenges?: ChallengeTiming[]
}

export default function MonitoringPage() {
    const [sessions, setSessions] = useState<SessionSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    useEffect(() => {
        const fetchSessions = () => {
            fetch("http://localhost:8000/api/sessions?limit=50")
                .then((res) => res.json())
                .then((data) => {
                    setSessions(data)
                    setLoading(false)
                })
                .catch((err) => {
                    console.error("Failed to load sessions", err)
                    setLoading(false)
                })
        }

        fetchSessions()
        const interval = setInterval(fetchSessions, 5000)
        return () => clearInterval(interval)
    }, [])

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedRows(newExpanded)
    }

    const averageLatency = sessions.reduce((acc, s) => {
        const total = s.timing_metrics?.total_latency_ms || 0
        return acc + total
    }, 0) / (sessions.filter(s => s.timing_metrics).length || 1)

    const averageDiagnostic = sessions.reduce((acc, s) => {
        const diag = s.timing_metrics?.diagnostic_ms || 0
        return acc + diag
    }, 0) / (sessions.filter(s => s.timing_metrics).length || 1)

    return (
        <div className="min-h-screen bg-muted/10">
            <main className="mx-auto max-w-7xl p-8 space-y-8">

                {/* Page Header & Actions */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">System Performance Monitor</h1>
                </div>


                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                            <Play className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sessions.length}</div>
                            <p className="text-xs text-muted-foreground">Recorded sessions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Total Latency</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(averageLatency / 1000).toFixed(2)}s</div>
                            <p className="text-xs text-muted-foreground">Per generation run</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Diag Time</CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(averageDiagnostic / 1000).toFixed(2)}s</div>
                            <p className="text-xs text-muted-foreground">Per session</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <Server className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {((sessions.filter(s => s.status === 'completed').length / (sessions.length || 1)) * 100).toFixed(0)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Completion rate</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sessions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30px]"></TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Statements</TableHead>
                                        <TableHead>Total Time</TableHead>
                                        <TableHead>Diagnostic</TableHead>
                                        <TableHead>Retrieval</TableHead>
                                        <TableHead>Timeline</TableHead>
                                        <TableHead>Brief</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.map((session) => (
                                        <Fragment key={session.id}>
                                            <TableRow
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => toggleRow(session.id)}
                                            >
                                                <TableCell>
                                                    {expandedRows.has(session.id) ? (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {new Date(session.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={session.status} />
                                                </TableCell>
                                                <TableCell>
                                                    {session.statement_count}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {session.timing_metrics
                                                        ? (session.timing_metrics.total_latency_ms / 1000).toFixed(2) + "s"
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {session.timing_metrics
                                                        ? (session.timing_metrics.diagnostic_ms / 1000).toFixed(2) + "s"
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {session.timing_metrics
                                                        ? (session.timing_metrics.retrieval_ms / 1000).toFixed(2) + "s"
                                                        : "-"}
                                                </TableCell>
                                                <TableCell className="w-[180px]">
                                                    {session.timing_metrics ? (
                                                        <div className="flex h-2 w-full rounded-full bg-secondary overflow-hidden" title="Timeline: Amber=Diagnostic, Gray=Retrieval, Blue=Gen/Eval">
                                                            {/* Diagnostic - Amber */}
                                                            <div
                                                                className="bg-amber-400"
                                                                style={{ width: `${(session.timing_metrics.diagnostic_ms / (session.timing_metrics.total_latency_ms || 1)) * 100}%` }}
                                                                title={`Diagnostic: ${session.timing_metrics.diagnostic_ms}ms`}
                                                            />
                                                            {/* Retrieval - Zinc */}
                                                            <div
                                                                className="bg-zinc-400"
                                                                style={{ width: `${(session.timing_metrics.retrieval_ms / (session.timing_metrics.total_latency_ms || 1)) * 100}%` }}
                                                                title={`Retrieval: ${session.timing_metrics.retrieval_ms}ms`}
                                                            />
                                                            {/* Gen/Eval - Primary */}
                                                            <div
                                                                className="bg-primary/80"
                                                                style={{ width: `${100 - ((session.timing_metrics.diagnostic_ms + session.timing_metrics.retrieval_ms) / (session.timing_metrics.total_latency_ms || 1)) * 100}%` }}
                                                                title={`Processing: ${(session.timing_metrics.total_latency_ms - session.timing_metrics.diagnostic_ms - session.timing_metrics.retrieval_ms)}ms`}
                                                            />
                                                        </div>
                                                    ) : "-"}
                                                </TableCell>
                                                <TableCell className="max-w-[300px] truncate text-muted-foreground text-xs">
                                                    {session.brief_preview}
                                                </TableCell>
                                            </TableRow>
                                            {expandedRows.has(session.id) && session.challenges && (
                                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                    <TableCell colSpan={8} className="p-4">
                                                        <div className="rounded-md border bg-background p-4">
                                                            <h4 className="mb-4 text-sm font-semibold">Challenge Generation Details</h4>
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-[80px]">Format</TableHead>
                                                                        <TableHead>Gen Model</TableHead>
                                                                        <TableHead>Gen Tokens (In/Out)</TableHead>
                                                                        <TableHead>Gen Time (s)</TableHead>
                                                                        <TableHead>Eval Model</TableHead>
                                                                        <TableHead>Eval Tokens (In/Out)</TableHead>
                                                                        <TableHead>Eval Time (s)</TableHead>
                                                                        <TableHead className="text-right">Timeline</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {session.challenges.map((challenge) => (
                                                                        <TableRow key={challenge.id}>
                                                                            <TableCell className="font-medium">{challenge.format}</TableCell>
                                                                            <TableCell className="text-xs text-muted-foreground">
                                                                                {challenge.gen_model || "-"}
                                                                            </TableCell>
                                                                            <TableCell className="text-xs font-mono">
                                                                                {challenge.gen_input_tokens || 0} / {challenge.gen_output_tokens || 0}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {challenge.generation_time_ms ? (challenge.generation_time_ms / 1000).toFixed(2) + "s" : "-"}
                                                                            </TableCell>
                                                                            <TableCell className="text-xs text-muted-foreground">
                                                                                {challenge.eval_model || "-"}
                                                                            </TableCell>
                                                                            <TableCell className="text-xs font-mono">
                                                                                {challenge.eval_input_tokens || 0} / {challenge.eval_output_tokens || 0}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {challenge.evaluation_time_ms ? (challenge.evaluation_time_ms / 1000).toFixed(2) + "s" : "-"}
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <div className="flex justify-end gap-1 h-2 w-full max-w-[200px] ml-auto">
                                                                                    <div
                                                                                        className="bg-blue-500 rounded-l-sm"
                                                                                        style={{ width: `${((challenge.generation_time_ms || 0) / 3000) * 100}%` }}
                                                                                        title={`Generation: ${challenge.generation_time_ms}ms`}
                                                                                    />
                                                                                    <div
                                                                                        className="bg-green-500 rounded-r-sm"
                                                                                        style={{ width: `${((challenge.evaluation_time_ms || 0) / 3000) * 100}%` }}
                                                                                        title={`Evaluation: ${challenge.evaluation_time_ms}ms`}
                                                                                    />
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    ))}
                                    {sessions.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No sessions recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === "completed") {
        return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Completed</Badge>
    }
    if (status === "error") {
        return <Badge variant="destructive">Error</Badge>
    }
    if (status === "generating") {
        return <Badge variant="secondary" className="animate-pulse">Generating</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
}
