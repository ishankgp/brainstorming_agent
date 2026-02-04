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

    // Actions
    setBriefText: (text: string) => void
    setAppStatus: (status: AppStatus) => void
    setResult: (result: GenerationResult | null) => void
    setError: (error: string | null) => void
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

            setBriefText: (text) => set({ briefText: text }),
            setAppStatus: (status) => set({ appStatus: status }),
            setResult: (result) => set({ result }),
            setError: (error) => set({ error }),

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
                lastIncludeResearch: false
            })
        }),
        {
            name: 'brainstorm-agent-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
