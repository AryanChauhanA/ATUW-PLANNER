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

  useEffect(() => {
    localStorage.setItem('atuw_neural_notes', JSON.stringify(notes))
  }, [notes])

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
    if (parentId) setActiveBranchId(newNote.id)
    else {
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
        
        {/* COLUMN 1: Nexus List */}
        <NexusList 
          hubs={rootHubs}
          activeHubId={activeHubId}
          setActiveHubId={setActiveHubId}
          setActiveBranchId={setActiveBranchId}
          createNote={createNote}
        />

        {/* COLUMN 2: Hub Editor */}
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
          />
        )}

        {/* COLUMN 3: Branch Editor */}
        {activeBranch && (
          <BranchEditor 
            branch={activeBranch}
            parentHub={activeHub}
            setActiveBranchId={setActiveBranchId}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        )}
      </div>
    </div>
  )
}