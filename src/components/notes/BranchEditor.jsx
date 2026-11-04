import { useState } from 'react'
import { ChevronLeft, GitBranch, Trash2, AlertOctagon, Network, Maximize2, Minimize2 } from 'lucide-react'

export default function BranchEditor({ branch, parentHub, branches, setActiveBranchId, updateNote, deleteNote, isHidden, isMaximized, toggleMaximize }) {
  const [deleteArmed, setDeleteArmed] = useState(false)

  const containerClasses = `flex flex-col h-full flex-1 min-w-0 bg-brand/5 backdrop-blur-xl border border-brand/30 rounded-2xl p-4 transition-all shadow-[0_0_30px_rgba(14,165,233,0.05)] ${isHidden ? 'hidden' : ''}`

  const handleDelete = () => {
    if (deleteArmed) {
      deleteNote(branch.id)
    } else {
      setDeleteArmed(true)
      setTimeout(() => setDeleteArmed(false), 3000)
    }
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-3 border-b border-brand/20 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveBranchId(null)} className="md:hidden flex items-center text-brand text-xs font-bold">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-brand uppercase tracking-widest font-bold bg-brand/10 w-max px-2 py-1 rounded-md">
            <GitBranch size={12} /> Synaptic Branch
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PC Maximize Button */}
          <button 
            onClick={toggleMaximize} 
            className="hidden md:flex items-center p-1.5 text-brand hover:bg-brand/10 rounded-md transition-all"
            title={isMaximized ? "Exit Focus Mode" : "Focus Mode"}
          >
            {isMaximized ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
          </button>

          <button 
            onClick={handleDelete}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold transition-all ${
              deleteArmed ? 'bg-red-500/20 text-red-500' : 'text-muted hover:bg-brand/10 hover:text-red-400'
            }`}
          >
            {deleteArmed ? <><AlertOctagon size={12}/> CONFIRM DELETE</> : <Trash2 size={14}/>}
          </button>
        </div>
      </div>

      {branches && branches.length > 1 && (
        <div className="md:hidden flex overflow-x-auto w-full gap-2 pb-3 mb-3 border-b border-brand/10 custom-scrollbar flex-shrink-0">
          {branches.map(b => (
            <button
              key={b.id}
              onClick={() => setActiveBranchId(b.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                branch.id === b.id
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-surface border border-border text-muted hover:text-brand'
              }`}
            >
              <Network size={10} />
              {b.title || 'Untitled'}
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        value={branch.title}
        onChange={(e) => updateNote(branch.id, 'title', e.target.value)}
        placeholder="Branch Title..."
        className="bg-transparent text-lg md:text-xl font-bold text-primary focus:outline-none mb-4"
      />
      <textarea
        value={branch.content}
        onChange={(e) => updateNote(branch.id, 'content', e.target.value)}
        placeholder="Expand on this connected thought..."
        className="flex-1 bg-transparent text-sm md:text-base text-primary/80 focus:outline-none resize-none custom-scrollbar leading-relaxed"
      />
    </div>
  )
}