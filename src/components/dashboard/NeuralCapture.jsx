import { useState } from 'react'
import { Zap, BrainCircuit } from 'lucide-react'

export default function NeuralCapture() {
  const [quickNote, setQuickNote] = useState('')

  const handleCapture = (e) => {
    e.preventDefault()
    if (!quickNote.trim()) return

    const savedNotes = JSON.parse(localStorage.getItem('atuw_neural_notes') || '[]')
    const newHub = {
      id: Date.now().toString(),
      title: quickNote,
      content: '',
      parentId: null,
      updatedAt: Date.now()
    }
    
    localStorage.setItem('atuw_neural_notes', JSON.stringify([newHub, ...savedNotes]))
    setQuickNote('')
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-center h-full">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-brand" /> {/* Changed from text-amber-500 to text-brand */}
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Quick Capture</h2>
      </div>
      
      <form onSubmit={handleCapture} className="flex gap-2">
        <input
          type="text"
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          placeholder="Spawn a Neural Hub..."
          className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand/50 text-primary"
        />
        <button 
          type="submit"
          disabled={!quickNote.trim()}
          className="bg-brand/10 hover:bg-brand/20 text-brand disabled:opacity-50 disabled:hover:bg-brand/10 border border-brand/20 rounded-xl px-3 py-2 transition-all flex justify-center items-center"
        >
          <BrainCircuit size={16} />
        </button>
      </form>
    </div>
  )
}