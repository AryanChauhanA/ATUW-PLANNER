import { User, Cloud } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

export default function AccountSettings() {
  const { displayName, setDisplayName } = useSettings()

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <User size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Account</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Display Name</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-brand/50 transition-all"
            placeholder="What should we call you?"
          />
        </div>

        <div className="pt-2">
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Cloud Sync</label>
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <Cloud size={24} className="text-muted/50" />
            <p className="text-xs text-muted">Sign in to sync your schedule across devices and backup your streaks.</p>
            <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm w-full">
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}