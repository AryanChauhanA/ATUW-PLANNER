import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-primary overflow-hidden relative transition-colors duration-300">
      
      {/* Ambient Orbs (Adaptive) */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full filter blur-[180px] pointer-events-none"></div>

      <Sidebar />
      
      {/* Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}