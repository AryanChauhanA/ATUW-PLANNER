import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, BrainCircuit, Settings } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: LayoutDashboard },
    { path: '/schedule', icon: CalendarDays },
    { path: '/notes', icon: BrainCircuit },
    { path: '/settings', icon: Settings },
  ]

  // Find which tab is active to calculate the position of the slider pill
  const activeIndex = navItems.findIndex(item => location.pathname === item.path)
  const safeIndex = activeIndex === -1 ? 0 : activeIndex

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-surface/95 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl p-2 relative flex items-center">
        
        {/* The Gliding Background Pill */}
        <div 
          className="absolute left-0 top-0 h-full w-1/4 p-2 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${safeIndex * 100}%)` }}
        >
          <div className="w-full h-full bg-brand/15 rounded-full"></div>
        </div>

        {/* The Clickable Icons */}
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative z-10 flex-1 flex items-center justify-center py-3 transition-colors duration-300 ${
                isActive ? 'text-brand' : 'text-muted hover:text-primary'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300" />
            </NavLink>
          )
        })}
        
      </div>
    </div>
  )
}