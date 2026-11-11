import { Sparkles } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

export default function AIEngineSettings() {
  const { aiStyle, setAiStyle } = useSettings()

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm border-t-brand/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">AI Engine</h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Scheduling Logic</label>
          <select 
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-primary text-sm focus:outline-none focus:border-brand/50 transition-all"
          >
            <option value="Balanced">Balanced (Default)</option>
            <option value="Aggressive">Aggressive (Maximum Density)</option>
            <option value="Relaxed">Relaxed (More spacing)</option>
          </select>
        </div>
        <p className="text-[11px] text-muted leading-relaxed">
          Controls how the AI packs tasks into your week when automatically generating your schedule. More natural language controls coming soon.
        </p>
      </div>
    </div>
  )
}