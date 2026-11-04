import { useState, useEffect } from 'react'
import { BrainCircuit } from 'lucide-react'
import NexusList from '../components/notes/NexusList'
import HubEditor from '../components/notes/HubEditor'
import BranchEditor from '../components/notes/BranchEditor'

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('atuw_neural_notes')
    return saved ? JSON.parse(saved) : []
  })

  const [activeHubId, setActiveHubId] = useState(null)
  const [activeBranchId, setActiveBranchId] = useState(null)
  const [maximizedNode, setMaximizedNode] = useState(null) // 'hub' | 'branch' | null

  useEffect(() => {
    localStorage.setItem('atuw_neural_notes', JSON.stringify(notes))
  }, [notes])

  // Reset maximize state if the active node is closed
  useEffect(() => {
    if (!activeHubId && maximizedNode === 'hub') setMaximizedNode(null)
    if (!activeBranchId && maximizedNode === 'branch') setMaximizedNode(null)
  }, [activeHubId, activeBranchId, maximizedNode])

  const rootHubs = notes.filter(n => !n.parentId)
  const activeHub = notes.find(n => n.id === activeHubId)
  const activeBranch = notes.find(n => n.id === activeBranchId)
  const hubBranches = activeHub ? notes.filter(n => n.parentId === activeHub.id) : []

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
      if (maximizedNode === 'hub') setMaximizedNode(null) // Un-maximize hub if branching
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

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id && n.parentId !== id))
    if (activeHubId === id) {
      setActiveHubId(null)
      setActiveBranchId(null)
    }
    if (activeBranchId === id) setActiveBranchId(null)
  }

  return (
    <div className="flex flex-col h-full pb-20 md:pb-4 max-w-[1600px] mx-auto overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-xl md:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <BrainCircuit className="text-brand" size={28} /> Neural Notes
        </h1>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
        
        <NexusList 
          hubs={rootHubs}
          activeHubId={activeHubId}
          setActiveHubId={setActiveHubId}
          setActiveBranchId={setActiveBranchId}
          createNote={createNote}
          isHidden={maximizedNode !== null} 
        />

        {activeHub && (
          <HubEditor 
            hub={activeHub}
            branches={hubBranches}
            activeBranchId={activeBranchId}
            activeHubId={activeHubId}
            setActiveHubId={setActiveHubId}
            setActiveBranchId={setActiveBranchId}
            updateNote={updateNote}
            createNote={createNote}
            deleteNote={deleteNote}
            isHidden={maximizedNode === 'branch'}
            isMaximized={maximizedNode === 'hub'}
            toggleMaximize={() => setMaximizedNode(maximizedNode === 'hub' ? null : 'hub')}
          />
        )}

        {activeBranch && (
          <BranchEditor 
            branch={activeBranch}
            parentHub={activeHub}
            branches={hubBranches}
            setActiveBranchId={setActiveBranchId}
            updateNote={updateNote}
            deleteNote={deleteNote}
            isHidden={maximizedNode === 'hub'}
            isMaximized={maximizedNode === 'branch'}
            toggleMaximize={() => setMaximizedNode(maximizedNode === 'branch' ? null : 'branch')}
          />
        )}
      </div>
    </div>
  )
}