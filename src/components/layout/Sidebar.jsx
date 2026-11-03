import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useTheme } from '../../contexts/ThemeContext'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  // This automatically applies the blue highlight if the link is active
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
        <img 
          src={logo} 
          alt="ATUW Logo" 
          className="w-10 h-10 object-contain drop-shadow-md rounded-md"
        />
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500 tracking-wider leading-none">
            ATUW
          </h2>
          <p className="text-[10px] text-brand font-bold tracking-[0.2em] uppercase mt-1">
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