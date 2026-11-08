import { useState } from 'react'
import { Zap, BrainCircuit, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NeuralCapture() {
  const [quickNote, setQuickNote] = useState('')
  const navigate = useNavigate()

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
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-between md:h-full min-h-[160px]">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand" />
            <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Quick Capture</h2>
          </div>
          
          <button 
            onClick={() => navigate('/notes')}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 hover:bg-brand/20 px-2.5 py-1 rounded-md transition-colors"
          >
            Open Notes <ExternalLink size={10} />
          </button>
        </div>
        
        <p className="text-xs text-muted mb-4 leading-relaxed max-w-sm">
          Instantly spawn a new Root Hub in your Neural Notes without breaking focus.
        </p>
      </div>
      
      <form onSubmit={handleCapture} className="flex gap-2 mt-auto items-stretch">
        <input
          type="text"
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          placeholder="Record a thought..."
          className="flex-1 bg-background border border-border rounded-xl px-4 h-12 md:h-14 text-sm focus:outline-none focus:border-brand/50 text-primary transition-colors"
        />
        <button 
          type="submit"
          disabled={!quickNote.trim()}
          className="bg-brand/10 hover:bg-brand/20 text-brand disabled:opacity-50 disabled:hover:bg-brand/10 border border-brand/20 rounded-xl px-4 h-12 md:h-14 w-12 md:w-14 transition-all flex justify-center items-center flex-shrink-0"
        >
          <BrainCircuit size={18} />
        </button>
      </form>
    </div>
  )
}