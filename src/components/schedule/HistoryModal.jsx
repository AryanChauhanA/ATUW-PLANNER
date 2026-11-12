import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function HistoryModal({ isOpen, onClose, currentTasks, onLoadSnapshot }) {
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('atuw_schedule_history') 
      if (!savedHistory) return []
      const parsedData = JSON.parse(savedHistory)
      if (!Array.isArray(parsedData)) return []
      return parsedData
    } catch (error) {
      return [] 
    }
  })

  // 1. Initial Cloud Pull
  useEffect(() => {
    const fetchCloudHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('schedule_history')
        .select('*')
        .order('created_at', { ascending: false }) // Newest first

      if (data && data.length > 0) {
        const formattedHistory = data.map(row => ({
          id: row.id,
          ...row.snapshot_data // Unpacks the name, timestamp, and task array
        }))
        setHistory(formattedHistory)
        localStorage.setItem('atuw_schedule_history', JSON.stringify(formattedHistory))
      }
    }
    fetchCloudHistory()
  }, [])

  useEffect(() => {
    localStorage.setItem('atuw_schedule_history', JSON.stringify(history))
  }, [history])

  if (!isOpen) return null

  const handleSaveSnapshot = async () => {
    const safeTasks = Array.isArray(currentTasks) ? currentTasks : []
    const newSnapshot = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString([], { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      name: `Snapshot ${history.length + 1}`,
      tasks: [...safeTasks] 
    }
    
    // 1. Local update
    setHistory([newSnapshot, ...history]) 

    // 2. Cloud update
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('schedule_history').insert({
        id: newSnapshot.id,
        user_id: session.user.id,
        snapshot_data: {
          timestamp: newSnapshot.timestamp,
          name: newSnapshot.name,
          tasks: newSnapshot.tasks
        }
      })
    }
  }
  
  const handleDelete = async (id) => {
    // 1. Local update
    setHistory(history.filter(h => h.id !== id))

    // 2. Cloud update
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('schedule_history').delete().eq('id', id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-md border-t-brand/50 flex flex-col max-h-[80vh]">
        
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Schedule Versions</h2>
            <p className="text-sm font-medium text-muted mt-1">Save and load previous states</p>
          </div>
          <button 
            onClick={handleSaveSnapshot}
            className="px-3 py-2 md:px-4 md:py-2 bg-brand/10 text-brand border border-brand/20 rounded-xl text-xs md:text-sm font-bold hover:bg-brand hover:text-white transition-all shadow-sm whitespace-nowrap"
          >
            + Save Current
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[200px]">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted text-sm italic py-8">
              No versions saved yet.
            </div>
          ) : (
            history.map((snapshot) => (
              <div key={snapshot.id} className="p-4 bg-background border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between group hover:border-brand/30 transition-colors gap-3">
                <div>
                  <h3 className="font-bold text-primary text-sm">{snapshot.name}</h3>
                  <p className="text-xs text-muted mt-1">{snapshot.timestamp}</p>
                </div>
                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(snapshot.id)}
                    className="flex-1 md:flex-none px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20 md:border-none"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => {
                      onLoadSnapshot(snapshot.tasks || [])
                      onClose()
                    }}
                    className="flex-1 md:flex-none px-4 py-1.5 bg-surface text-primary border border-border rounded-lg text-xs font-bold hover:bg-surface-hover transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-surface text-primary border border-border rounded-xl text-sm font-bold hover:bg-surface-hover transition-all w-full md:w-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}