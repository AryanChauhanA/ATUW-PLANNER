import { User, Sparkles, Sliders, Palette, ShieldAlert, Cloud, Clock, Bell, Moon, Sun, MessageSquare } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const {
    displayName, setDisplayName,
    strictMode, setStrictMode,
    audioChimes, setAudioChimes,
    startOfWeek, setStartOfWeek,
    timeFormat, setTimeFormat,
    defaultBlock, setDefaultBlock,
    accentColor, setAccentColor,
    aiStyle, setAiStyle
  } = useSettings()

  // Nuclear Reset Function
  const handleWipeData = () => {
    if (window.confirm("⚠️ Are you absolutely sure? This will permanently erase ALL tasks, neural notes, history, and preferences.")) {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('atuw_')) {
          localStorage.removeItem(key)
        }
      })
      window.location.reload()
    }
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pt-20 md:pt-8 w-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">Settings</h1>
          <p className="text-sm text-muted">Manage your preferences, cloud sync, and AI engine.</p>
        </div>

        {/* 2-Column Layout for Main Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Account & Sync */}
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

            {/* AI Engine */}
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

            {/* Feedback & Open Source */}
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-brand" />
                <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Feedback & Source</h2>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mb-5">
                ATUW Planner is an open-source project. Feel free to report bugs, suggest features, or view the repository.
              </p>
              
              <a 
                href="https://github.com/AryanChauhanA/ATUW-PLANNER"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-primary hover:border-brand/50 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                View GitHub Repository
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Appearance */}
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

            {/* Workflow & Preferences */}
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

            {/* Focus & Notifications */}
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

          </div>
        </div>

        {/* FULL WIDTH BOTTOM SECTION: Danger Zone */}
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

        {/* Original Footer with Personal Links */}
        <div className="flex flex-col items-center justify-center mt-12 mb-8 space-y-4">
          <p className="text-xs font-bold text-muted uppercase tracking-widest">v1.0.0</p>
          <div className="flex gap-4">
            <a href="https://github.com/AryanChauhanA" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://linkedin.com/in/aryanatuw" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
          <p className="text-[10px] text-muted/50">Designed & Engineered by Aryan Chauhan</p>
        </div>

      </div>
    </div>
  )
}