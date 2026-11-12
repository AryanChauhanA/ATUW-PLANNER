import { AlertTriangle, Trash2, CalendarX2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function DangerZone() {
  
  const handleClearSchedule = async () => {
    const confirmed = window.confirm("Are you sure you want to clear your entire schedule? This will delete all current tasks. Your settings and neural notes will be safe.")
    if (!confirmed) return

    try {
      // 1. Clear Local Storage
      localStorage.setItem('atuw_tasks', '[]')
      
      // 2. Clear Cloud (If logged in)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('tasks').delete().eq('user_id', session.user.id)
      }

      // 3. Force a reload to instantly clear the UI
      window.location.reload()
    } catch (error) {
      console.error("Error clearing schedule:", error)
    }
  }

  const handleWipeData = async () => {
    const confirmed = window.confirm("WARNING: This will permanently delete ALL your tasks, notes, history, and settings from this device and the cloud. This cannot be undone. Proceed?")
    if (!confirmed) return

    try {
      // 1. Clear all ATUW keys from Local Storage
      const keys = ['atuw_tasks', 'atuw_neural_notes', 'atuw_schedule_history', 'atuw_history', 'atuw_username', 'atuw_strict', 'atuw_audio', 'atuw_weekstart', 'atuw_timeformat', 'atuw_defaultblock', 'atuw_accent', 'atuw_aistyle']
      keys.forEach(key => localStorage.removeItem(key))

      // 2. Clear Cloud (If logged in)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const userId = session.user.id
        await supabase.from('tasks').delete().eq('user_id', userId)
        await supabase.from('neural_notes').delete().eq('user_id', userId)
        await supabase.from('schedule_history').delete().eq('user_id', userId)
        await supabase.from('user_settings').delete().eq('user_id', userId)
        
        // Log them out since their account data is wiped
        await supabase.auth.signOut()
      }

      // 3. Send them back to the dashboard fresh
      window.location.href = '/'
    } catch (error) {
      console.error("Error wiping data:", error)
    }
  }

  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 md:p-6 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle size={18} className="text-red-500" />
        <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h2>
      </div>
      
      <p className="text-sm text-muted mb-6">
        Destructive actions. Please be certain before proceeding as these cannot be undone.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clear Schedule Button */}
        <button 
          onClick={handleClearSchedule}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-surface border border-red-500/30 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-colors"
        >
          <CalendarX2 size={18} />
          Clear Schedule
        </button>

        {/* Wipe All Data Button */}
        <button 
          onClick={handleWipeData}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 size={18} />
          Factory Reset Data
        </button>
      </div>
    </div>
  )
}