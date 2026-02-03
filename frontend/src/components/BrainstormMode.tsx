
import { useState } from 'react'
import axios from 'axios'
import { BrainCircuit, ArrowRight, Lightbulb, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const API_URL = 'http://localhost:8000'

interface Analysis {
    original_statement: string
    critique: string
    refinement: string
    citations: string[]
}

interface BrainstormResult {
    thought_trace: string
    analysis: {
        analyses: Analysis[]
    }
}

export default function BrainstormMode() {
    const [statements, setStatements] = useState<string[]>(['', '', ''])
    const [result, setResult] = useState<BrainstormResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [showThoughts, setShowThoughts] = useState(false)

    const handleInputChange = (index: number, value: string) => {
        const newStatements = [...statements]
        newStatements[index] = value
        setStatements(newStatements)
    }

    const handleAnalyze = async () => {
        const validStatements = statements.filter(s => s.trim())
        if (validStatements.length === 0) return

        setLoading(true)
        setResult(null)

        try {
            const res = await axios.post(`${API_URL}/brainstorm`, {
                statements: validStatements
            })
            setResult(res.data)
        } catch (err) {
            alert('Analysis failed')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <div className="header mb-2 text-center flex-col items-center">
                <h2 className="title text-3xl mb-2 flex items-center gap-3">
                    <BrainCircuit size={32} /> Brainstorm Agent
                </h2>
                <p className="text-gray-500 max-w-lg text-center">
                    Input your draft problem statements. The agent will critique them against the Data Library,
                    identify gaps, and suggest scientifically robust refinements.
                </p>
            </div>

            <div className="card bg-white/50 border-blue-100">
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-700">Draft Statements</h3>
                    {statements.map((stmt, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold shrink-0">
                                {idx + 1}
                            </div>
                            <input
                                className="input"
                                placeholder={`Problem statement ${idx + 1}...`}
                                value={stmt}
                                onChange={(e) => handleInputChange(idx, e.target.value)}
                            />
                        </div>
                    ))}

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className={`btn btn-primary px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-80' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">Analyzing Data Library... <span className="animate-spin">⟳</span></span>
                            ) : (
                                <span className="flex items-center gap-2">Analyze Statements <ArrowRight size={20} /></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {result && (
                <div className="flex flex-col gap-6">

                    {result.thought_trace && result.thought_trace !== "No thought trace provided." && (
                        <div className="border border-indigo-100 rounded-xl overflow-hidden bg-indigo-50/50">
                            <button
                                onClick={() => setShowThoughts(!showThoughts)}
                                className="w-full flex items-center justify-between p-4 text-indigo-700 font-medium hover:bg-indigo-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <BrainCircuit size={18} />
                                    <span>View Agent Thought Process</span>
                                </div>
                                {showThoughts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            {showThoughts && (
                                <div className="p-4 pt-0 text-sm text-gray-600 border-t border-indigo-100 prose prose-indigo max-w-none bg-white/50">
                                    <ReactMarkdown>{result.thought_trace}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        {result.analysis?.analyses?.map((item, idx) => (
                            <div key={idx} className="card border-l-4 border-l-primary p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Lightbulb size={100} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Original Input</h4>
                                            <p className="font-medium text-lg text-gray-800 italic">"{item.original_statement}"</p>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm">
                                            <h4 className="flex items-center gap-2 font-bold mb-2">
                                                <AlertTriangle size={16} /> Gaps & Critique
                                            </h4>
                                            <ReactMarkdown>{item.critique}</ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 border-l border-gray-100 lg:pl-8">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-wider text-green-600 font-bold mb-1">Refined Statement</h4>
                                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                                                <p className="text-lg font-semibold text-green-900 leading-relaxed">
                                                    {item.refinement}
                                                </p>
                                            </div>
                                        </div>

                                        {item.citations && item.citations.length > 0 && (
                                            <div className="text-xs text-gray-500">
                                                <span className="font-bold">Sources:</span> {item.citations.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
