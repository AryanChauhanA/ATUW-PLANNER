import { useState } from 'react'
import { Plus, GitBranch, ChevronLeft, Trash2, AlertOctagon } from 'lucide-react'

export default function HubEditor({ hub, branches, activeBranchId, activeHubId, setActiveHubId, setActiveBranchId, updateNote, createNote, deleteNote }) {
  const [deleteArmed, setDeleteArmed] = useState(false)

  const containerClasses = `flex flex-col h-full flex-1 bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 transition-all relative ${
    activeHubId && !activeBranchId ? 'flex' : (activeHubId ? 'hidden md:flex' : 'hidden')
  }`

  const handleDelete = () => {
    if (deleteArmed) {
      deleteNote(hub.id)
    } else {
      setDeleteArmed(true)
      setTimeout(() => setDeleteArmed(false), 3000) // Auto-disarms after 3 seconds
    }
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <button onClick={() => setActiveHubId(null)} className="md:hidden flex items-center text-muted hover:text-brand text-xs font-bold">
          <ChevronLeft size={16} /> Hubs
        </button>
        <span className="hidden md:flex text-xs font-bold text-muted uppercase tracking-widest">Main Hub</span>
        
        {/* Bulletproof Two-Step Delete */}
        <button 
          onClick={handleDelete}
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold transition-all ${
            deleteArmed ? 'bg-red-500/20 text-red-500' : 'text-muted hover:bg-surface-hover hover:text-red-400'
          }`}
        >
          {deleteArmed ? <><AlertOctagon size={12}/> CONFIRM DELETE</> : <Trash2 size={14}/>}
        </button>
      </div>

      <input
        type="text"
        value={hub.title}
        onChange={(e) => updateNote(hub.id, 'title', e.target.value)}
        placeholder="Hub Title..."
        className="bg-transparent text-xl md:text-2xl font-bold text-primary focus:outline-none mb-4"
      />
      <textarea
        value={hub.content}
        onChange={(e) => updateNote(hub.id, 'content', e.target.value)}
        placeholder="Start typing your main thought here..."
        className="flex-1 bg-transparent text-sm md:text-base text-primary/80 focus:outline-none resize-none custom-scrollbar leading-relaxed"
      />

      <div className="mt-4 pt-4 border-t border-border flex flex-col h-32 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1">
            <GitBranch size={14}/> Synaptic Branches
          </span>
          <button 
            onClick={() => createNote(hub.id)}
            className="flex items-center gap-1 text-[10px] bg-brand/10 text-brand px-2 py-1 rounded-md font-bold hover:bg-brand/20 transition-all"
          >
            <Plus size={12} /> ADD BRANCH
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar flex-1 items-start">
          {branches.length === 0 ? (
            <span className="text-xs text-muted/50 italic">No branches connected.</span>
          ) : (
            branches.map(branch => (
              <div 
                key={branch.id}
                onClick={() => setActiveBranchId(branch.id)}
                className={`min-w-[140px] max-w-[160px] p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                  activeBranchId === branch.id 
                    ? 'bg-brand border-brand text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                    : 'bg-surface hover:bg-brand/5 border-border hover:border-brand/30 text-primary'
                }`}
              >
                <span className="text-xs font-bold truncate">{branch.title || 'Untitled'}</span>
                <span className={`text-[9px] truncate ${activeBranchId === branch.id ? 'text-white/80' : 'text-muted'}`}>
                  {branch.content || 'Empty node...'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}