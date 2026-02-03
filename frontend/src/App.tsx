
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Files, Settings, BrainCircuit } from 'lucide-react'
import './index.css'

// Placeholder components - will be implemented in separate files
import AgentList from './components/AgentList'
import WorkshopChat from './components/WorkshopChat'
import DocumentLib from './components/DocumentLib'
import BrainstormSession from './components/BrainstormSession'

function NavLink({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-600 hover:bg-white hover:shadow-sm'
        }`}
      style={{
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        color: isActive ? 'white' : 'var(--color-text-light)',
      }}
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </Link>
  )
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold text-gray-800">Agent Studio</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/" icon={LayoutDashboard}>Agents</NavLink>
          <NavLink to="/brainstorm" icon={BrainCircuit}>Brainstorm Mode</NavLink>
          <NavLink to="/workshop" icon={MessageSquare}>Workshop Chat</NavLink>
          <NavLink to="/library" icon={Files}>Data Library</NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="text-xs text-center text-gray-400">
            v1.0.0 • Connected to Local
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="container">
          <Routes>
            <Route path="/" element={<AgentList />} />
            <Route path="/brainstorm" element={<BrainstormSession />} />
            <Route path="/workshop" element={<WorkshopChat />} />
            <Route path="/library" element={<DocumentLib />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}
