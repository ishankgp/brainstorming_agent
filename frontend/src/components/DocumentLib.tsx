
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Upload, Trash2, FileText, CheckCircle, AlertCircle, Files } from 'lucide-react'

const API_URL = 'http://localhost:8000'

interface Doc {
    name: string
    display_name: string
    state: string
}

export default function DocumentLib() {
    const [docs, setDocs] = useState<Doc[]>([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDocs()
    }, [])

    const fetchDocs = async () => {
        try {
            const res = await axios.get(`${API_URL}/documents`)
            setDocs(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            await axios.post(`${API_URL}/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            await fetchDocs()
        } catch (err) {
            setError('Upload failed. Check backend logs.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return
        try {
            await axios.delete(`${API_URL}/documents/${fileName}`)
            fetchDocs()
        } catch (err) {
            alert('Delete failed')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="header mb-0">
                <div>
                    <h2 className="title text-2xl">Data Library</h2>
                    <p className="text-gray-500">Manage knowledge base for RAG (PDF, MD, TXT)</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`btn btn-primary cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                    >
                        {uploading ? <span className="animate-spin">⟳</span> : <Upload size={18} />}
                        Upload Document
                    </label>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                    <div key={doc.name} className="card flex flex-col gap-3 group">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <button
                                onClick={() => handleDelete(doc.name)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="font-semibold truncate" title={doc.display_name}>
                                {doc.display_name}
                            </h3>
                            <p className="text-xs text-gray-400 font-mono truncate">{doc.name}</p>
                        </div>

                        <div className={`mt-auto text-xs font-medium py-1 px-2 rounded-full w-fit ${doc.state === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {doc.state}
                        </div>
                    </div>
                ))}

                {docs.length === 0 && !uploading && (
                    <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <Files size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No documents found.</p>
                        <p className="text-sm">Upload files to start building the library.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
