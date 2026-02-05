import { useRef, useCallback } from "react"
import { GenerationResult, ChallengeStatement } from "@/lib/types"
import { useAppStore } from "@/lib/store"

export type GenerationStatus = "idle" | "loading" | "success" | "error"

export interface UseChallengeGeneratorReturn {
    generate: (brief: string, includeResearch: boolean, selectedResearchIds: string[]) => Promise<void>
    cancel: () => void
    result: GenerationResult | null
    status: GenerationStatus
    error: string | null
    logs: string[]
    currentStep: string
}

export function useChallengeGenerator(): UseChallengeGeneratorReturn {
    const {
        result, setResult,
        appStatus: status, setAppStatus: setStatus,
        error, setError,
        logs, setLogs, addLog,
        currentStep, setCurrentStep
    } = useAppStore()

    const abortControllerRef = useRef<AbortController | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setStatus("idle")
        addLog("Process cancelled by user.")
        setCurrentStep("Cancelled")
    }, [setStatus, addLog, setCurrentStep])

    const generate = useCallback(async (brief: string, includeResearch: boolean, selectedResearchIds: string[]) => {
        // Reset state
        setResult(null)
        setError(null)
        setLogs([])
        setStatus("loading")
        setCurrentStep("Initializing Agent...")
        addLog("Initializing generation process...")

        // Setup AbortController
        const controller = new AbortController()
        abortControllerRef.current = controller

        // Timeout safety (120s)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            console.warn("Request timed out")
            controller.abort()
            setError("Request timed out after 120 seconds.")
            setStatus("error")
            setCurrentStep("Timed Out")
            addLog("Error: Request timed out.")
        }, 120000)

        try {
            addLog("Sending request to backend...")

            // Load model config
            let modelConfig = null
            try {
                const savedConfig = localStorage.getItem("challenge_model_config")
                if (savedConfig) {
                    modelConfig = JSON.parse(savedConfig)
                    addLog("Loaded custom model configuration.")
                }
            } catch (e) { }

            const response = await fetch('http://localhost:8000/api/generate-challenge-statements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brief_text: brief,
                    include_research: includeResearch,
                    selected_research_ids: includeResearch ? selectedResearchIds : null,
                    generator_config: modelConfig
                }),
                signal: controller.signal
            })

            // unexpected error
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `API request failed: ${response.status}`)
            }

            if (!response.body) throw new Error("Response body is empty")

            addLog("Connection established. Receiving stream...")
            setCurrentStep("Diagnosing Brief...")

            // Stream Reader
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            // Init empty result
            let currentResult: GenerationResult = {
                challenge_statements: [],
                diagnostic_summary: "",
                diagnostic_path: []
            }

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const parts = buffer.split('\n\n')
                buffer = parts.pop() || ""

                for (const part of parts) {
                    if (part.startsWith('data: ')) {
                        const jsonStr = part.slice(6).trim()
                        if (!jsonStr) continue

                        try {
                            const event = JSON.parse(jsonStr)

                            if (event.type === 'diagnostic') {
                                addLog(" Diagnostic analysis complete.")
                                setCurrentStep("Generating Challenges...")

                                currentResult = {
                                    ...currentResult,
                                    diagnostic_summary: event.data.diagnostic_summary,
                                    diagnostic_path: event.data.diagnostic_path
                                }
                                setResult({ ...currentResult })
                                // REMOVED: setStatus("success") - We keep "loading" to show the agent working
                            }
                            else if (event.type === 'challenge_generation') {
                                // DELAY: Pacing for agentic feel (1.5s per card)
                                await new Promise(resolve => setTimeout(resolve, 1500))

                                const stmt = event.data as ChallengeStatement
                                addLog(`Generated Statement #${stmt.position} (${stmt.selected_format})`)

                                // Add if not exists
                                if (!currentResult.challenge_statements.find(s => s.id === stmt.id)) {
                                    const newStmts = [...currentResult.challenge_statements, stmt].sort((a, b) => a.id - b.id)
                                    currentResult = { ...currentResult, challenge_statements: newStmts }
                                    setResult({ ...currentResult })
                                }
                            }
                            else if (event.type === 'challenge_evaluation') {
                                const evalData = event.data as ChallengeStatement
                                addLog(`Evaluated Statement #${evalData.id}`)

                                const updatedStmts = currentResult.challenge_statements.map(s =>
                                    s.id === evalData.id ? { ...s, ...evalData } : s
                                )
                                currentResult = { ...currentResult, challenge_statements: updatedStmts }
                                setResult({ ...currentResult })
                            }
                            else if (event.type === 'complete') {
                                addLog("All tasks completed successfully.")
                                setCurrentStep("Complete")
                                setStatus("success") // Triggers the final UI state (hides loading card)
                            }
                            else if (event.type === 'error') {
                                throw new Error(event.message)
                            }
                        } catch (e) {
                            console.error("Parse error", e)
                        }
                    }
                }
            }

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Handled in cancel/timeout
                return
            }
            console.error("Hook error:", err)
            setError(err instanceof Error ? err.message : "Unknown error")
            setStatus("error")
            setCurrentStep("Failed")
            addLog(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
        } finally {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }

    }, [setStatus, setResult, setError, setLogs, addLog, setCurrentStep])

    return {
        generate,
        cancel,
        result,
        status,
        error,
        logs,
        currentStep
    }
}
