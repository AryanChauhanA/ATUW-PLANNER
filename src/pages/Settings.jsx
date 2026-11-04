import { useTheme } from '../contexts/ThemeContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full pb-8">
      
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-extrabold text-primary tracking-tight">Settings</h1>
      </div>
      
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm max-w-2xl">
        <h3 className="text-lg font-bold text-primary mb-6 border-b border-border/50 pb-2">Appearance</h3>
        
        <div className="flex items-center justify-between py-2">
          <p className="font-semibold text-primary text-base">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </p>
          
          <button 
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-brand' : 'bg-slate-300'}`}
          >
            <span 
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
      
    </div>
  )
}