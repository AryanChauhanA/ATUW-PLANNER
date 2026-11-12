import { useState, useEffect, useCallback } from 'react'
import { BrainCircuit } from 'lucide-react'
import { supabase } from '../lib/supabase'

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
  const [maximizedNode, setMaximizedNode] = useState(null) 

  // 1. The Cloud Sync Engine (Debounced)
  const syncWithCloud = useCallback(async (currentLocalNotes) => {
    localStorage.setItem('atuw_neural_notes', JSON.stringify(currentLocalNotes))
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const cloudReadyNotes = currentLocalNotes.map(note => ({
        id: note.id,
        user_id: session.user.id,
        content: note.content || '',
        metadata: {
          title: note.title,
          parentId: note.parentId,
          updatedAt: note.updatedAt
        }
      }))

      if (cloudReadyNotes.length > 0) {
        await supabase.from('neural_notes').upsert(cloudReadyNotes, { onConflict: 'id' })
      }
    } catch (error) {
      console.error("Notes Sync Error:", error)
    }
  }, [])

  // 2. Initial Cloud Pull
  useEffect(() => {
    const fetchCloudNotes = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase.from('neural_notes').select('*')
      
      if (data && data.length > 0) {
        const formattedData = data.map(dbNote => ({
          id: dbNote.id,
          content: dbNote.content,
          ...dbNote.metadata // Unpacks title, parentId, updatedAt
        }))
        
        setNotes(formattedData)
        localStorage.setItem('atuw_neural_notes', JSON.stringify(formattedData))
      }
    }
    fetchCloudNotes()
  }, [])

  // 3. Trigger Sync (with 1-second debounce for smooth typing)
  useEffect(() => {
    const timeoutId = setTimeout(() => syncWithCloud(notes), 1000)
    return () => clearTimeout(timeoutId)
  }, [notes, syncWithCloud])

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
      if (maximizedNode === 'hub') setMaximizedNode(null) 
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

  const deleteNote = async (id) => {
    // 1. Local update
    setNotes(notes.filter(n => n.id !== id && n.parentId !== id))
    if (activeHubId === id) {
      setActiveHubId(null)
      setActiveBranchId(null)
    }
    if (activeBranchId === id) setActiveBranchId(null)

    // 2. Cloud update (Directly delete to keep DB clean)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('neural_notes').delete().eq('id', id)
      // Also delete any child branches that belong to this hub
      await supabase.from('neural_notes').delete().eq('metadata->>parentId', id)
    }
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