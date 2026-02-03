
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Bot, ChevronRight, Check } from 'lucide-react'

const API_URL = 'http://localhost:8000'

interface Agent {
    id: number
    name: string
    description: string
    system_prompt: string
    tools: string
}

const AVAILABLE_TOOLS = [
    { id: 'search_data_library', label: 'Search Library', desc: 'Find clinical/market data' },
    { id: 'analyze_brand_positioning', label: 'Analyze Positioning', desc: 'Identify gaps & contradictions' },
    { id: 'check_regulatory_compliance', label: 'Check Compliance', desc: 'Review claims for risks' }
]

export default function AgentList() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [showForm, setShowForm] = useState(false)

    // Form State
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [prompt, setPrompt] = useState('')
    const [selectedTools, setSelectedTools] = useState<string[]>([])

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            const res = await axios.get(`${API_URL}/agents`)
            setAgents(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_URL}/agents`, {
                name,
                description: desc,
                system_prompt: prompt,
                tools: selectedTools
            })
            setShowForm(false)
            // Reset form
            setName('')
            setDesc('')
            setPrompt('')
            setSelectedTools([])
            fetchAgents()
        } catch (err) {
            alert('Failed to create agent')
        }
    }

    const toggleTool = (toolId: string) => {
        setSelectedTools(prev =>
            prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="header mb-0">
                <div>
                    <h2 className="title text-2xl">Agents</h2>
                    <p className="text-gray-500">Manage specialized agents for the workshop</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="btn btn-primary">
                        <Plus size={20} /> New Agent
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card mb-6 animate-in slide-in-from-top-4 fade-in duration-200">
                    <h3 className="text-lg font-bold mb-4">Create New Agent</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Agent Name</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Creative Copywriter"
                                    value={name} onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Description (for Router)</label>
                                <input
                                    className="input"
                                    placeholder="What does this agent do?"
                                    value={desc} onChange={e => setDesc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">System Prompt</label>
                            <textarea
                                className="textarea h-32"
                                placeholder="You are an expert in..."
                                value={prompt} onChange={e => setPrompt(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Assign Tools</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {AVAILABLE_TOOLS.map(tool => (
                                    <div
                                        key={tool.id}
                                        onClick={() => toggleTool(tool.id)}
                                        className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${selectedTools.includes(tool.id)
                                                ? 'border-primary bg-blue-50/50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{tool.label}</div>
                                            <div className="text-xs text-gray-500">{tool.desc}</div>
                                        </div>
                                        {selectedTools.includes(tool.id) && (
                                            <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                                <Check size={12} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Create Agent
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {agents.map(agent => (
                    <div key={agent.id} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Bot size={24} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-800">{agent.name}</h3>
                                {JSON.parse(agent.tools || '[]').length > 0 && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        {JSON.parse(agent.tools).length} tools
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 truncate text-sm">{agent.description}</p>
                        </div>

                        <button className="text-gray-400 hover:text-primary transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
