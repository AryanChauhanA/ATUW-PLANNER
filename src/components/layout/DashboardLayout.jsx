import Sidebar from './Sidebar'
import MobileNav from './MobileNav' // <-- Import the new mobile nav

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-primary">
      
      {/* Desktop Sidebar: Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-28 md:pb-8">
        {children}
      </main>

      {/* Mobile Navigation Pill: Visible on mobile, hidden on desktop */}
      <MobileNav />
      
    </div>
  )
}