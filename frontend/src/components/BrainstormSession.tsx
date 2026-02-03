
import { useState } from 'react'
import axios from 'axios'
import { BrainCircuit, ArrowRight, Save, Check, FileText, AlertTriangle, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:8000'

interface InputState {
    marketingBrief: string
    lifecycleStage: string
    audience: string
    statements: string[]
}

export default function BrainstormSession() {
    const navigate = useNavigate()
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState<InputState>({
        marketingBrief: '',
        lifecycleStage: 'pre_launch',
        audience: 'HCPs (Oncologists)',
        statements: ['', '', '']
    })
    const [result, setResult] = useState<any>(null)
    const [selectedStatementIds, setSelectedStatementIds] = useState<Set<string>>(new Set())

    // Step 1: Create Session & Inputs
    const handleStartRun = async () => {
        setLoading(true)
        try {
            // 1. Create Session
            const sRes = await axios.post(`${API_URL}/brainstorm/sessions`, {
                marketing_brief_text: inputs.marketingBrief,
                lifecycle_stage: inputs.lifecycleStage,
                target_audience: inputs.audience
            })
            const sId = sRes.data.id
            setSessionId(sId)

            // 2. Add Inputs
            await axios.post(`${API_URL}/brainstorm/sessions/${sId}/inputs`, {
                statements: inputs.statements.filter(s => s.trim())
            })

            // 3. Run
            const rRes = await axios.post(`${API_URL}/brainstorm/sessions/${sId}/run`)
            setResult(rRes.data)
            setStep(2)
        } catch (e) {
            console.error(e)
            alert('Error running brainstorm session')
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Toggle Selection
    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedStatementIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedStatementIds(newSet)
    }

    // Step 2 -> 3: Lock
    const handleLock = async () => {
        if (selectedStatementIds.size < 1) return alert("Select at least 1 statement")

        const finals = result.candidate_statements.filter((c: any) => selectedStatementIds.has(c.id))

        try {
            await axios.post(`${API_URL}/brainstorm/sessions/${sessionId}/lock`, { finals })
            setStep(3)
        } catch (e) {
            alert('Error locking session')
        }
    }

    // Render Logic
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Brainstorm Agent</h1>
                    <p className="text-gray-500">Evidence-based challenge statement generator</p>
                </div>
            </header>

            {/* Steps Indicator */}
            <div className="flex gap-4 mb-8">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block font-medium">Marketing Brief Summary</label>
                            <textarea
                                className="w-full h-40 p-3 border rounded-lg"
                                placeholder="Paste key context from the brief..."
                                value={inputs.marketingBrief}
                                onChange={e => setInputs({ ...inputs, marketingBrief: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium">Lifecycle Stage</label>
                                <select
                                    className="w-full p-3 border rounded-lg"
                                    value={inputs.lifecycleStage}
                                    onChange={e => setInputs({ ...inputs, lifecycleStage: e.target.value })}
                                >
                                    <option value="pre_launch">Pre-Launch</option>
                                    <option value="launch">Launch</option>
                                    <option value="post_launch">Post-Launch</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium">Target Audience</label>
                                <input
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="e.g. Neurologists"
                                    value={inputs.audience}
                                    onChange={e => setInputs({ ...inputs, audience: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block font-medium">Draft Problem Statements (2-3)</label>
                        {inputs.statements.map((s, i) => (
                            <input
                                key={i}
                                className="w-full p-3 border rounded-lg"
                                placeholder={`Statement ${i + 1}`}
                                value={s}
                                onChange={e => {
                                    const newS = [...inputs.statements]
                                    newS[i] = e.target.value
                                    setInputs({ ...inputs, statements: newS })
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleStartRun}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Running Agent...' : 'Analyze & Generate Candidates'} <ArrowRight size={20} />
                        </button>
                        {!loading && (
                            <button
                                onClick={() => setInputs({
                                    marketingBrief: "Launching Ozempic for Cardiovascular Risk Reduction. The goal is to move beyond 'Glycemic Control' and establish it as a life-saving CV intervention. We need Cardiologists to prescribe it, but they currently see it as an 'Endocrinologist's drug' for sugar or just a 'weight loss trend' from TikTok.",
                                    lifecycleStage: 'launch',
                                    audience: 'Cardiologists & Endocrinologists',
                                    statements: [
                                        "Cardiologists don't want to prescribe a diabetes drug because they don't want to manage blood sugar.",
                                        "Doctors are skeptical because patients only ask for it for cosmetic weight loss.",
                                        "They think SGLT2s are better for the heart so they don't need GLP-1s."
                                    ]
                                })}
                                className="px-4 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium whitespace-nowrap"
                            >
                                Load Ozempic Mock Data
                            </button>
                        )}
                    </div>
                </div>
            )}

            {step === 2 && result && (
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Panel: Analysis */}
                    <div className="col-span-1 space-y-6">
                        {/* Thought Process Accordion */}
                        {result.thought_process && result.thought_process.length > 0 && (
                            <div className="bg-white p-6 rounded-xl border shadow-sm border-purple-100">
                                <h3 className="font-bold text-purple-700 flex items-center gap-2 mb-4">
                                    <Lightbulb size={18} /> Model Thinking
                                </h3>
                                <div className="max-h-60 overflow-y-auto text-xs text-gray-600 font-mono bg-purple-50 p-3 rounded">
                                    {result.thought_process.map((thought: string, i: number) => (
                                        <div key={i} className="mb-2 pb-2 border-b border-purple-100 last:border-0">
                                            {thought}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                                <FileText size={18} /> Diagnostics
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded">
                                    <span className="font-bold block text-gray-500 text-xs uppercase">Broken Path</span>
                                    {result.session_summary.diagnostic_path}
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <span className="font-bold block text-gray-500 text-xs uppercase">Core Issue</span>
                                    {result.session_summary.what_is_broken}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Candidates */}
                    <div className="col-span-2 space-y-4">
                        <h3 className="font-bold text-gray-800">Candidate Statements</h3>
                        {result.candidate_statements.map((cand: any) => (
                            <div key={cand.id}
                                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedStatementIds.has(cand.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                                onClick={() => toggleSelect(cand.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                        Format #{cand.format_id}: {cand.format_name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-gray-700">{cand.weighted_score.toFixed(1)}</span>
                                        {selectedStatementIds.has(cand.id) && <Check className="text-blue-500" />}
                                    </div>
                                </div>

                                <p className="text-xl font-medium text-gray-900 mb-4">"{cand.statement_text}"</p>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                    <div>
                                        <strong>Solves:</strong> {cand.what_this_solves}
                                    </div>
                                    <div>
                                        <strong>Risk Flags:</strong>
                                        {cand.risk_flags?.length > 0 ? (
                                            cand.risk_flags.map((f: any, idx: number) => (
                                                <span key={idx} className="block text-red-600 flex items-center gap-1">
                                                    <AlertTriangle size={12} /> {f.type}
                                                </span>
                                            ))
                                        ) : <span className="text-green-600 block">None detected</span>}
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded border text-xs text-gray-500">
                                    <strong>Key Evidence:</strong>
                                    <ul className="list-disc pl-4 mt-1">
                                        {cand.key_citations?.map((cit: any, i: number) => (
                                            <li key={i}>{cit.location_label}: {cit.why_relevant}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleLock}
                            className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 w-full mt-8 shadow-lg"
                        >
                            Lock Selected Statements ({selectedStatementIds.size})
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && result && (
                <div className="max-w-2xl mx-auto text-center space-y-8 pt-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={40} />
                    </div>
                    <h2 className="text-3xl font-bold">Session Locked</h2>
                    <p className="text-gray-600">The statements have been saved to the library.</p>

                    <div className="bg-gray-100 p-6 rounded-xl text-left font-mono text-sm overflow-auto max-h-96">
                        <pre>{JSON.stringify(result.draft_brief_snippet, null, 2)}</pre>
                    </div>

                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg" onClick={() => navigate('/')}>
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    )
}
