import { Bell, Clock } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

export default function FocusAlertsSettings() {
  const { strictMode, setStrictMode, audioChimes, setAudioChimes } = useSettings()

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Bell size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Focus & Alerts</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <label className="text-sm font-bold text-primary block flex items-center gap-2">
              <Clock size={14} className="text-brand" /> Strict Mode
            </label>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">
              Locks the Daily Agenda to the current time. If a scheduled block finishes, you can no longer check it off. 
            </p>
          </div>
          <button 
            onClick={() => setStrictMode(!strictMode)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${strictMode ? 'bg-brand' : 'bg-surface border border-border'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${strictMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="pt-4 border-t border-border/50 flex items-start justify-between gap-4">
          <div>
            <label className="text-sm font-bold text-primary block">Audio Chimes</label>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">
              Play a soft ping when a task begins or is completed.
            </p>
          </div>
          <button 
            onClick={() => setAudioChimes(!audioChimes)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${audioChimes ? 'bg-brand' : 'bg-surface border border-border'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${audioChimes ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}