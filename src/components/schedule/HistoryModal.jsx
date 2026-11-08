import { useState, useEffect } from 'react'

export default function HistoryModal({ isOpen, onClose, currentTasks, onLoadSnapshot }) {
  // CRASH-PROOF: Safely load and validate history from local storage
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('atuw_schedule_history') // Changed key to isolate from heatmap history
      if (!savedHistory) return []
      
      const parsedData = JSON.parse(savedHistory)
      
      // Strict check: if it's not an array, discard it to prevent .map() crashes
      if (!Array.isArray(parsedData)) {
        console.warn("Corrupted history data found. Resetting schedule history.")
        return []
      }
      
      return parsedData
    } catch (error) {
      console.error("Failed to parse schedule history:", error)
      return [] // Fallback to empty array on failure
    }
  })

  // Auto-save history changes to local storage
  useEffect(() => {
    localStorage.setItem('atuw_schedule_history', JSON.stringify(history))
  }, [history])

  if (!isOpen) return null

  // Create a new snapshot of the current schedule
  const handleSaveSnapshot = () => {
    const safeTasks = Array.isArray(currentTasks) ? currentTasks : []
    
    const newSnapshot = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString([], { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      name: `Snapshot ${history.length + 1}`,
      tasks: [...safeTasks] // Deep copy of safe current tasks
    }
    setHistory([newSnapshot, ...history]) // Add to top of list
  }
  
  const handleDelete = (id) => {
    setHistory(history.filter(h => h.id !== id))
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
        
        {/* Scrollable List of Snapshots */}
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