import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { GenerationResult } from './types'

type AppStatus = "idle" | "loading" | "success" | "error"

interface AppState {
    // State
    briefText: string
    appStatus: AppStatus
    result: GenerationResult | null
    error: string | null
    selectedResearch: string[]
    lastIncludeResearch: boolean
    logs: string[]
    currentStep: string
    isLibraryOpen: boolean

    // Actions
    setBriefText: (text: string) => void
    setAppStatus: (status: AppStatus) => void
    setResult: (result: GenerationResult | null) => void
    setError: (error: string | null) => void
    setLogs: (logs: string[]) => void
    addLog: (log: string) => void
    setCurrentStep: (step: string) => void
    setIsLibraryOpen: (isOpen: boolean) => void

    setSelectedResearch: (ids: string[]) => void
    setLastIncludeResearch: (include: boolean) => void
    toggleResearch: (id: string) => void
    reset: () => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            briefText: "",
            appStatus: "idle",
            result: null,
            error: null,
            selectedResearch: [],
            lastIncludeResearch: false,
            logs: [],
            currentStep: "Idle",
            isLibraryOpen: false,

            setBriefText: (text) => set({ briefText: text }),
            setAppStatus: (status) => set({ appStatus: status }),
            setResult: (result) => set({ result }),
            setError: (error) => set({ error }),
            setLogs: (logs) => set({ logs }),
            addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
            setCurrentStep: (step) => set({ currentStep: step }),
            setIsLibraryOpen: (isOpen) => set({ isLibraryOpen: isOpen }),

            setSelectedResearch: (ids) => set({ selectedResearch: ids }),
            setLastIncludeResearch: (include) => set({ lastIncludeResearch: include }),

            toggleResearch: (id) => set((state) => ({
                selectedResearch: state.selectedResearch.includes(id)
                    ? state.selectedResearch.filter((i) => i !== id)
                    : [...state.selectedResearch, id]
            })),

            reset: () => set({
                briefText: "",
                appStatus: "idle",
                result: null,
                error: null,
                selectedResearch: [],
                lastIncludeResearch: false,
                logs: [],
                currentStep: "Idle",
                isLibraryOpen: false
            })
        }),
        {
            name: 'brainstorm-agent-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

