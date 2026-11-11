import { Palette, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSettings } from '../../contexts/SettingsContext'

export default function AppearanceSettings() {
  const { theme, toggleTheme } = useTheme()
  const { accentColor, setAccentColor } = useSettings()

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Palette size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Appearance</h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted uppercase tracking-wider block">Theme Mode</label>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 text-sm font-bold text-primary hover:border-brand/50 transition-all"
          >
            {theme === 'dark' ? <Moon size={16} className="text-brand" /> : <Sun size={16} className="text-amber-500" />}
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className="pt-4 border-t border-border/50">
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">Accent Color</label>
          <div className="flex gap-4">
            <button onClick={() => setAccentColor('cyan')} className={`w-8 h-8 rounded-full bg-cyan-500 transition-all ${accentColor === 'cyan' ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} />
            <button onClick={() => setAccentColor('magenta')} className={`w-8 h-8 rounded-full bg-fuchsia-500 transition-all ${accentColor === 'magenta' ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} />
            <button onClick={() => setAccentColor('emerald')} className={`w-8 h-8 rounded-full bg-emerald-500 transition-all ${accentColor === 'emerald' ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} />
            <button onClick={() => setAccentColor('amber')} className={`w-8 h-8 rounded-full bg-amber-500 transition-all ${accentColor === 'amber' ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}