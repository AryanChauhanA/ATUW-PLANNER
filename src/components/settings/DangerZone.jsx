import { ShieldAlert } from 'lucide-react'
import { playWarning } from '../../utils/audio'

export default function DangerZone() {
  const handleWipeData = () => {
    // Play the warning buzz immediately when they click
    playWarning()
    
    // Slight delay so they hear the sound before the prompt blocks the browser
    setTimeout(() => {
      if (window.confirm("⚠️ Are you absolutely sure? This will permanently erase ALL tasks, neural notes, history, and preferences.")) {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('atuw_')) {
            localStorage.removeItem(key)
          }
        })
        window.location.reload()
      }
    }, 50)
  }

  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={18} className="text-red-500" />
          <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-500/80">Permanently erase all local tasks, notes, history, and preferences. This cannot be undone.</p>
      </div>
      <button 
        onClick={handleWipeData}
        className="whitespace-nowrap px-5 py-2.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
      >
        Wipe Local Data
      </button>
    </div>
  )
}