import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

import WelcomeHeader from '../components/dashboard/WelcomeHeader'
import NowAndNext from '../components/dashboard/NowAndNext'
import DailyAgenda from '../components/dashboard/DailyAgenda'
import ContributionGrid from '../components/dashboard/ContributionGrid'
import NeuralCapture from '../components/dashboard/NeuralCapture'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [history, setHistory] = useState({})
  
  // Modals
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)

  // BULLETPROOF DATA HYDRATION (Prevents the White Screen Crash)
  useEffect(() => {
    try {
      const rawTasks = localStorage.getItem('tasks') || localStorage.getItem('atuw_tasks')
      const rawHistory = localStorage.getItem('atuw_history')
      
      if (rawTasks) setTasks(JSON.parse(rawTasks))
      if (rawHistory) setHistory(JSON.parse(rawHistory))
    } catch (error) {
      console.error("Dashboard Data Corrupted. Resetting safely.", error)
      setTasks([])
      setHistory({})
    }
  }, [])

  return (
    <div className="flex flex-col h-full max-w-[1200px] mx-auto overflow-y-auto custom-scrollbar pb-24 space-y-4 md:space-y-6 relative">
      
      <WelcomeHeader openSignIn={() => setSignInModalOpen(true)} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
          <NowAndNext tasks={tasks} />
          <NeuralCapture />
        </div>
        <div className="h-full">
          <DailyAgenda tasks={tasks} history={history} setHistory={setHistory} />
        </div>
      </div>

      <ContributionGrid history={history} />

      {/* ATUW AI Floating Action Button */}
      <button 
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-10 bg-brand hover:bg-brand/90 text-white rounded-full p-4 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 transition-all z-50 flex items-center gap-2 group"
      >
        <Sparkles size={24} className="group-hover:animate-spin" />
        <span className="hidden md:block font-bold pr-2">ATUW AI</span>
      </button>

      {/* Modals Container */}
      {(aiModalOpen || signInModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          
          {/* AI Modal */}
          {aiModalOpen && (
            <div className="bg-surface border border-brand/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setAiModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-primary">✕</button>
              <div className="flex flex-col items-center text-center gap-4">
                <Sparkles size={48} className="text-brand opacity-50" />
                <h2 className="text-2xl font-bold text-primary">ATUW AI Core</h2>
                <p className="text-muted text-sm">
                  Neural connection is currently offline. AI assistance, auto-scheduling, and smart insights are scheduled for the next major update.
                </p>
              </div>
            </div>
          )}

          {/* Sign In Modal */}
          {signInModalOpen && (
            <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setSignInModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-primary">✕</button>
              <div className="flex flex-col items-center text-center gap-4">
                <h2 className="text-xl font-bold text-primary">Sign In to ATUW</h2>
                <div className="bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Coming Soon</div>
                <p className="text-muted text-sm mb-4">
                  Account creation will unlock Cloud Sync, Cross-Device Backup, and personalized AI model training. Currently running in secure Local-First Mode.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}