
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, Loader } from 'lucide-react'

// API Base URL
const API_URL = 'http://localhost:8000'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function WorkshopChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I are your Brand Workshop Assistant. I can help you research clinical data, analyze positioning, and check compliance. How can I help?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        try {
            const res = await axios.post(`${API_URL}/chat`, {
                message: userMsg
            })

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: Could not connect to the agent.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            <div className="header mb-0">
                <div>
                    <h2 className="title text-2xl">Workshop Chat</h2>
                    <p className="text-gray-500">Collaborate with the multi-agent team</p>
                </div>
            </div>

            <div className="card flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border text-secondary'
                                }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>

                            <div className={`p-4 rounded-xl shadow-sm prose prose-sm max-w-none ${msg.role === 'user'
                                    ? 'bg-primary text-white prose-invert rounded-tr-none'
                                    : 'bg-white border border-gray-100 rounded-tl-none'
                                }`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 max-w-[85%] self-start">
                            <div className="w-10 h-10 rounded-full bg-white border text-secondary flex items-center justify-center shadow-sm">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-xl rounded-tl-none shadow-sm flex items-center gap-2 text-gray-500">
                                <Loader className="animate-spin" size={16} />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-4 items-end">
                    <textarea
                        className="input resize-none flex-1 min-h-[50px] max-h-[150px]"
                        placeholder="Ask about clinical trials, positioning, or compliance..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                    <button
                        className="btn btn-primary h-[50px] w-[50px] !p-0 rounded-full flex items-center justify-center shrink-0"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
