import { useState, useEffect } from 'react'
import { Plus, Trash2, GitBranch, ChevronLeft, Network, BrainCircuit, X } from 'lucide-react'

export default function Notes() {
  // 1. LocalStorage Engine
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('atuw_neural_notes')
    return saved ? JSON.parse(saved) : []
  })

  // 2. Navigation State
  const [activeHubId, setActiveHubId] = useState(null)
  const [activeBranchId, setActiveBranchId] = useState(null)

  // Auto-save to LocalStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('atuw_neural_notes', JSON.stringify(notes))
  }, [notes])

  // Data Selectors
  const rootHubs = notes.filter(n => !n.parentId)
  const activeHub = notes.find(n => n.id === activeHubId)
  const activeBranch = notes.find(n => n.id === activeBranchId)
  const hubBranches = activeHub ? notes.filter(n => n.parentId === activeHub.id) : []

  // 3. CRUD Operations
  const createNote = (parentId = null) => {
    const newNote = {
      id: Date.now().toString(),
      title: parentId ? 'New Branch' : 'New Neural Hub',
      content: '',
      parentId,
      updatedAt: Date.now()
    }
    setNotes([newNote, ...notes])
    
    if (parentId) {
      setActiveBranchId(newNote.id)
    } else {
      setActiveHubId(newNote.id)
      setActiveBranchId(null)
    }
  }

  const updateNote = (id, field, value) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, [field]: value, updatedAt: Date.now() } : note
    ))
  }

  const deleteNote = (id, e) => {
    e.stopPropagation()
    // Delete the note AND any branches if it's a hub
    setNotes(notes.filter(n => n.id !== id && n.parentId !== id))
    if (activeHubId === id) {
      setActiveHubId(null)
      setActiveBranchId(null)
    }
    if (activeBranchId === id) {
      setActiveBranchId(null)
    }
  }

  // 4. Responsive Layout Classes
  // Mobile: Show Hubs only if nothing is selected. PC: Always show Hubs.
  const hubsColClasses = `flex flex-col h-full w-full md:w-72 bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-4 transition-all ${
    activeHubId ? 'hidden md:flex' : 'flex'
  }`

  // Mobile: Show Hub Editor if Hub selected but NO branch selected. PC: Show if Hub selected.
  const hubEditorColClasses = `flex flex-col h-full flex-1 bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 transition-all relative ${
    activeHubId && !activeBranchId ? 'flex' : (activeHubId ? 'hidden md:flex' : 'hidden')
  }`

  // Mobile & PC: Show Branch Editor only if a branch is selected. 
  // It gets a special brand-tinted glassmorphism to show it's a sub-level.
  const branchEditorColClasses = `flex flex-col h-full flex-1 bg-brand/5 backdrop-blur-xl border border-brand/30 rounded-2xl p-4 transition-all shadow-[0_0_30px_rgba(14,165,233,0.05)] ${
    activeBranchId ? 'flex' : 'hidden'
  }`

  return (
    <div className="flex flex-col h-full pb-20 md:pb-4 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* Header Area */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-xl md:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <BrainCircuit className="text-brand" size={28} />
          Neural Notes
        </h1>
        <p className="hidden md:block text-muted text-sm font-medium mt-1 uppercase tracking-widest">
          Interconnected Knowledge Hubs
        </p>
      </div>

      {/* Main Sliding Pane Interface */}
      <div className="flex flex-1 gap-4 overflow-hidden h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
        
        {/* COLUMN 1: The Nexus (Root Hubs) */}
        <div className={hubsColClasses}>
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
            {rootHubs.length === 0 ? (
              <div className="text-center mt-10 text-muted text-xs">No Hubs created yet.<br/>Start a new thought.</div>
            ) : (
              rootHubs.map(hub => (
                <div 
                  key={hub.id}
                  onClick={() => { setActiveHubId(hub.id); setActiveBranchId(null); }}
                  className={`group relative p-3 rounded-xl border cursor-pointer transition-all ${
                    activeHubId === hub.id 
                      ? 'bg-brand/10 border-brand/40 shadow-sm' 
                      : 'bg-surface hover:bg-surface-hover border-border/50 hover:border-border'
                  }`}
                >
                  <h3 className={`text-sm font-bold truncate pr-6 ${activeHubId === hub.id ? 'text-brand' : 'text-primary'}`}>
                    {hub.title || 'Untitled Hub'}
                  </h3>
                  <p className="text-[10px] text-muted mt-1 opacity-70">
                    {new Date(hub.updatedAt).toLocaleDateString()}
                  </p>
                  
                  {/* Delete Button (appears on hover) */}
                  <button 
                    onClick={(e) => deleteNote(hub.id, e)}
                    className="absolute right-2 top-2.5 p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-all md:block hidden"
                  >
                    <Trash2 size={14} />
                  </button>
                  {/* Mobile Delete */}
                  <button 
                    onClick={(e) => deleteNote(hub.id, e)}
                    className="absolute right-2 top-2.5 p-1.5 text-muted hover:text-red-400 rounded-md md:hidden"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: Active Hub Editor */}
        {activeHub && (
          <div className={hubEditorColClasses}>
            {/* Mobile Nav Header */}
            <div className="md:hidden flex items-center mb-3">
              <button onClick={() => setActiveHubId(null)} className="flex items-center text-muted hover:text-brand text-xs font-bold">
                <ChevronLeft size={16} /> Back to Hubs
              </button>
            </div>

            {/* Editor Area */}
            <input
              type="text"
              value={activeHub.title}
              onChange={(e) => updateNote(activeHub.id, 'title', e.target.value)}
              placeholder="Hub Title..."
              className="bg-transparent text-xl md:text-2xl font-bold text-primary focus:outline-none mb-4"
            />
            <textarea
              value={activeHub.content}
              onChange={(e) => updateNote(activeHub.id, 'content', e.target.value)}
              placeholder="Start typing your main thought here..."
              className="flex-1 bg-transparent text-sm md:text-base text-primary/80 focus:outline-none resize-none custom-scrollbar leading-relaxed"
            />

            {/* Branches Dock (Bottom of Hub) */}
            <div className="mt-4 pt-4 border-t border-border flex flex-col h-32 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                  <GitBranch size={14}/> Synaptic Branches
                </span>
                <button 
                  onClick={() => createNote(activeHub.id)}
                  className="flex items-center gap-1 text-[10px] bg-brand/10 text-brand px-2 py-1 rounded-md font-bold hover:bg-brand/20 transition-all"
                >
                  <Plus size={12} /> ADD BRANCH
                </button>
              </div>
              
              {/* Horizontal Scroll for Branches */}
              <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar flex-1 items-start">
                {hubBranches.length === 0 ? (
                  <span className="text-xs text-muted/50 italic">No branches connected.</span>
                ) : (
                  hubBranches.map(branch => (
                    <div 
                      key={branch.id}
                      onClick={() => setActiveBranchId(branch.id)}
                      className={`min-w-[140px] max-w-[160px] p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        activeBranchId === branch.id 
                          ? 'bg-brand border-brand text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                          : 'bg-surface hover:bg-brand/5 border-border hover:border-brand/30 text-primary'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold truncate pr-2">{branch.title || 'Untitled'}</span>
                        <button 
                          onClick={(e) => deleteNote(branch.id, e)}
                          className={`p-0.5 rounded ${activeBranchId === branch.id ? 'hover:bg-white/20' : 'text-muted hover:text-red-400'}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <span className={`text-[9px] truncate ${activeBranchId === branch.id ? 'text-white/80' : 'text-muted'}`}>
                        {branch.content || 'Empty node...'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* COLUMN 3: Active Branch Editor */}
        {activeBranch && (
          <div className={branchEditorColClasses}>
            {/* Mobile Nav Header (Deep Navigation) */}
            <div className="md:hidden flex flex-col mb-4 gap-1 border-b border-brand/10 pb-2">
              <button onClick={() => setActiveBranchId(null)} className="flex items-center text-brand text-xs font-bold mb-1">
                <ChevronLeft size={16} /> Back to {activeHub?.title || 'Hub'}
              </button>
              <div className="flex items-center gap-1 text-[10px] text-brand/60 uppercase tracking-widest font-bold">
                <Network size={10} /> Branch Mode
              </div>
            </div>

            {/* PC Badge */}
            <div className="hidden md:flex items-center gap-1 text-[10px] text-brand uppercase tracking-widest font-bold mb-3 bg-brand/10 w-max px-2 py-1 rounded-md">
              <GitBranch size={12} /> Synaptic Branch
            </div>

            <input
              type="text"
              value={activeBranch.title}
              onChange={(e) => updateNote(activeBranch.id, 'title', e.target.value)}
              placeholder="Branch Title..."
              className="bg-transparent text-lg md:text-xl font-bold text-primary focus:outline-none mb-4"
            />
            <textarea
              value={activeBranch.content}
              onChange={(e) => updateNote(activeBranch.id, 'content', e.target.value)}
              placeholder="Expand on this connected thought..."
              className="flex-1 bg-transparent text-sm md:text-base text-primary/80 focus:outline-none resize-none custom-scrollbar leading-relaxed"
            />
          </div>
        )}

      </div>
    </div>
  )
}