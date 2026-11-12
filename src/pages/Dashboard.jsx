import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

import WelcomeHeader from '../components/dashboard/WelcomeHeader'
import NowAndNext from '../components/dashboard/NowAndNext'
import DailyAgenda from '../components/dashboard/DailyAgenda'
import ContributionGrid from '../components/dashboard/ContributionGrid'
import NeuralCapture from '../components/dashboard/NeuralCapture'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [history, setHistory] = useState({})
  const [user, setUser] = useState(null)
  
  const [aiModalOpen, setAiModalOpen] = useState(false)

  // 1. Auth Listener & Cloud Data Hydration
  useEffect(() => {
    const fetchCloudData = async (userId) => {
      const { data: tasksData } = await supabase.from('tasks').select('*')
      if (tasksData && tasksData.length > 0) {
        const formattedTasks = tasksData.map(dbTask => ({
          ...dbTask.metadata,
          id: dbTask.id,
          day: dbTask.day,
          hour: dbTask.hour,
          duration: dbTask.duration || 60,
        }))
        setTasks(formattedTasks)
        localStorage.setItem('atuw_tasks', JSON.stringify(formattedTasks))
      }

      const { data: settingsData } = await supabase.from('user_settings').select('daily_history').eq('user_id', userId).single()
      if (settingsData && settingsData.daily_history) {
        setHistory(settingsData.daily_history)
        localStorage.setItem('atuw_history', JSON.stringify(settingsData.daily_history))
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session) fetchCloudData(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session) fetchCloudData(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Local Storage Fallback
  useEffect(() => {
    if (tasks.length === 0) {
      const rawTasks = localStorage.getItem('atuw_tasks')
      if (rawTasks) setTasks(JSON.parse(rawTasks))
    }
    if (Object.keys(history).length === 0) {
      const rawHistory = localStorage.getItem('atuw_history')
      if (rawHistory) setHistory(JSON.parse(rawHistory))
    }
  }, [tasks.length, history])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  return (
    <div className="flex flex-col h-full max-w-[1200px] mx-auto overflow-y-auto custom-scrollbar pb-24 space-y-4 md:space-y-6 relative pt-4">
      
      {/* 
        Passing user and login logic to the header. 
        We will wire WelcomeHeader to hide its button when 'user' exists.
      */}
      <WelcomeHeader 
        user={user} 
        onLogin={handleGoogleLogin} 
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
        <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
          <NowAndNext tasks={tasks} />
          <NeuralCapture />
        </div>
        <div className="h-full">
          <DailyAgenda tasks={tasks} history={history} setHistory={setHistory} />
        </div>
      </div>

      <ContributionGrid history={history} />

      <button 
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-10 bg-brand hover:bg-brand/90 text-white rounded-full p-4 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 transition-all z-50 flex items-center gap-2 group"
      >
        <Sparkles size={24} className="group-hover:animate-spin" />
        <span className="hidden md:block font-bold pr-2">ATUW AI</span>
      </button>

      {aiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
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
        </div>
      )}
    </div>
  )
}