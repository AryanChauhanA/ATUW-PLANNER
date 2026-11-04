import { Plus, Network } from 'lucide-react'

export default function NexusList({ hubs, activeHubId, setActiveHubId, setActiveBranchId, createNote }) {
  
  const containerClasses = `flex flex-col h-full w-full md:w-72 bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-4 transition-all ${
    activeHubId ? 'hidden md:flex' : 'flex'
  }`

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <span className="text-sm font-bold text-muted uppercase tracking-widest flex items-center gap-2">
          <Network size={16} /> Hubs
        </span>
        <button 
          onClick={() => createNote()}
          className="p-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {hubs.length === 0 ? (
          <div className="text-center mt-10 text-muted text-xs">No Hubs created yet.<br/>Start a new thought.</div>
        ) : (
          hubs.map(hub => (
            <div 
              key={hub.id}
              onClick={() => { setActiveHubId(hub.id); setActiveBranchId(null); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeHubId === hub.id 
                  ? 'bg-brand/10 border-brand/40 shadow-sm' 
                  : 'bg-surface hover:bg-surface-hover border-border/50 hover:border-border'
              }`}
            >
              <h3 className={`text-sm font-bold truncate ${activeHubId === hub.id ? 'text-brand' : 'text-primary'}`}>
                {hub.title || 'Untitled Hub'}
              </h3>
              <p className="text-[10px] text-muted mt-1 opacity-70">
                {new Date(hub.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}