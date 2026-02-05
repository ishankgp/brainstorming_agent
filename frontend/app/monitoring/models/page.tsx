"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const AVAILABLE_MODELS = [
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview (Powerful)" },
    { id: "gemini-3.0-flash", name: "Gemini 3 Flash (Fast)" },
]

interface ModelConfig {
    diagnostic_model: string
    generation_model: string
    evaluation_model: string
}

const DEFAULT_CONFIG: ModelConfig = {
    diagnostic_model: "gemini-3-pro-preview",
    generation_model: "gemini-3-pro-preview",
    evaluation_model: "gemini-3-pro-preview"
}

export default function ModelSelectionPage() {
    const router = useRouter()
    const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("challenge_model_config")
        if (saved) {
            setConfig(JSON.parse(saved))
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem("challenge_model_config", JSON.stringify(config))
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    const handleReset = () => {
        setConfig(DEFAULT_CONFIG)
        localStorage.removeItem("challenge_model_config")
    }

    return (
        <div className="min-h-screen bg-muted/10 p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/monitoring" className="flex items-center text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Monitoring
                </Link>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Model Configuration</h1>
                    <p className="text-muted-foreground">Select specific AI models for each stage of the generation process.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Global Model Settings</CardTitle>
                        <CardDescription>
                            Control the balance between speed and intelligence.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-3">
                            <Label>Diagnostic Model</Label>
                            <div className="text-sm text-muted-foreground mb-1">
                                Used for analyzing the marketing brief and selecting strategies.
                            </div>
                            <Select
                                value={config.diagnostic_model}
                                onValueChange={(val) => setConfig({ ...config, diagnostic_model: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_MODELS.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Generation Model</Label>
                            <div className="text-sm text-muted-foreground mb-1">
                                Used for creating the creative challenge statements.
                            </div>
                            <Select
                                value={config.generation_model}
                                onValueChange={(val) => setConfig({ ...config, generation_model: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_MODELS.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Evaluation Model</Label>
                            <div className="text-sm text-muted-foreground mb-1">
                                Used for scoring and critiquing the logic.
                            </div>
                            <Select
                                value={config.evaluation_model}
                                onValueChange={(val) => setConfig({ ...config, evaluation_model: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_MODELS.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleReset} className="flex gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Reset Defaults
                            </Button>

                            <Button onClick={handleSave} className="flex gap-2">
                                <Save className="w-4 h-4" />
                                {isSaved ? "Saved!" : "Save Configuration"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
