"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Server, Play, AlertCircle } from "lucide-react"
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
}

export default function MonitoringPage() {
    const [sessions, setSessions] = useState<SessionSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
    }, [])

    const averageLatency = sessions.reduce((acc, s) => {
        const total = s.timing_metrics?.total_latency_ms || 0
        return acc + total
    }, 0) / (sessions.filter(s => s.timing_metrics).length || 1)

    return (
        <div className="min-h-screen bg-muted/10">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-8">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold">System Performance Monitor</h1>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-8 space-y-8">

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
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
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Statements</TableHead>
                                        <TableHead>Total Time</TableHead>
                                        <TableHead>Diagnostic</TableHead>
                                        <TableHead>Retrieval</TableHead>
                                        <TableHead>Brief</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.map((session) => (
                                        <TableRow key={session.id}>
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
                                            <TableCell className="max-w-[300px] truncate text-muted-foreground text-xs">
                                                {session.brief_preview}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {sessions.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
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

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
