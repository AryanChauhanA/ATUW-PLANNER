import { NavLink } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import logo from '../../assets/logo.svg'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  const navLinkClass = ({ isActive }) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
      isActive 
        ? 'bg-brand/10 border border-brand/20 text-brand' 
        : 'text-muted hover:bg-surface-hover hover:text-primary'
    }`

  return (
    <aside className="w-64 h-screen bg-surface backdrop-blur-2xl border-r border-border p-6 flex flex-col z-20 transition-colors duration-300">
      
      {/* Brand Block */}
      <div className="flex items-center gap-3 mb-10">
        <a 
          href="https://github.com/AryanChauhanA/ATUW-PLANNER" 
          target="_blank" 
          rel="noreferrer"
          className="group relative transition-transform hover:scale-105 block"
          title="View Source Code"
        >
          <div className="absolute -inset-2 bg-brand/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* BRIGHT OUTER SQUARE */}
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm relative z-10"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {/* DARK INNER LOGO */}
            <div 
              className="w-full h-full transition-colors duration-300"
              style={{ 
                backgroundColor: '#0f172a',
                maskImage: `url(${logo})`, 
                WebkitMaskImage: `url(${logo})`,
                maskSize: '95%', /* <-- Change this to 90% or 100% if you want it even bigger */
                WebkitMaskSize: '95%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            ></div>
          </div>
        </a>
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand/70 tracking-wider leading-none transition-colors duration-300">
            ATUW
          </h2>
          <p className="text-[10px] text-brand font-bold tracking-[0.2em] uppercase mt-1 transition-colors duration-300">
            Planner
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        <NavLink to="/" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/schedule" className={navLinkClass}>
          Schedule Grid
        </NavLink>
        <NavLink to="/notes" className={navLinkClass}>
          Neural Notes
        </NavLink>
        <NavLink to="/settings" className={navLinkClass}>
          Settings
        </NavLink>
      </nav>

      {/* Theme Toggle Button */}
      <div className="pt-6 border-t border-border mt-auto">
        <button 
          onClick={toggleTheme}
          className="w-full flex justify-between items-center px-4 py-3 hover:bg-surface-hover rounded-xl text-sm font-semibold text-muted hover:text-primary transition-all"
        >
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          <div className={`w-8 h-4 rounded-full flex items-center p-1 transition-colors ${theme === 'dark' ? 'bg-brand' : 'bg-slate-300'}`}>
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-3' : ''}`} />
          </div>
        </button>
      </div>

    </aside>
  )
}