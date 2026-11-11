import { Sliders } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

export default function WorkflowPreferences() {
  const { startOfWeek, setStartOfWeek, timeFormat, setTimeFormat, defaultBlock, setDefaultBlock } = useSettings()

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Sliders size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Preferences</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Start of Week</label>
          <div className="flex bg-background border border-border rounded-xl p-1">
            <button onClick={() => setStartOfWeek('Monday')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${startOfWeek === 'Monday' ? 'bg-surface text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'}`}>Monday</button>
            <button onClick={() => setStartOfWeek('Sunday')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${startOfWeek === 'Sunday' ? 'bg-surface text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'}`}>Sunday</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Time Format</label>
            <div className="flex bg-background border border-border rounded-xl p-1">
              <button onClick={() => setTimeFormat('12h')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${timeFormat === '12h' ? 'bg-surface text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'}`}>12h</button>
              <button onClick={() => setTimeFormat('24h')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${timeFormat === '24h' ? 'bg-surface text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'}`}>24h</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Default Block</label>
            <select 
              value={defaultBlock}
              onChange={(e) => setDefaultBlock(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-primary text-sm font-bold focus:outline-none focus:border-brand/50 transition-all h-[36px]"
            >
              <option value="30">30 mins</option>
              <option value="45">45 mins</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}