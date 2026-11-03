import { useState, useEffect } from 'react'

export default function TaskModal({ isOpen, onClose, onSave, onDelete, selectedSlot, editingTask, tasks }) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('60')
  const [customDuration, setCustomDuration] = useState('')
  const [category, setCategory] = useState('Self Study')
  const [customCategory, setCustomCategory] = useState('')
  const [error, setError] = useState(null) // New error state

  // Populate data when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null) // Clear any previous errors
      if (editingTask) {
        setTitle(editingTask.title)
        
        const standardDurations = ['60', '90', '120']
        if (standardDurations.includes(editingTask.duration.toString())) {
          setDuration(editingTask.duration.toString())
          setCustomDuration('')
        } else {
          setDuration('custom')
          setCustomDuration(editingTask.duration.toString())
        }

        const standardCategories = ['Self Study', 'Exam', 'Other']
        if (standardCategories.includes(editingTask.category)) {
          setCategory(editingTask.category)
          setCustomCategory('')
        } else {
          setCategory('custom')
          setCustomCategory(editingTask.category)
        }
      } else {
        setTitle('')
        setDuration('60')
        setCustomDuration('')
        setCategory('Self Study')
        setCustomCategory('')
      }
    }
  }, [isOpen, editingTask])

  if (!isOpen || !selectedSlot) return null

  const formatHour = (h) => {
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  const handleSave = () => {
    if (!title.trim()) {
      setError("Task name is required.")
      return
    }

    const finalDuration = duration === 'custom' ? parseInt(customDuration) : parseInt(duration)
    const finalCategory = category === 'custom' ? customCategory : category
    
    if (!finalDuration || finalDuration <= 0) {
      setError("Please enter a valid duration.")
      return
    }

    // --- COLLISION DETECTION ALGORITHM ---
    const newStart = selectedSlot.hour * 60 // Convert start time to minutes
    const newEnd = newStart + finalDuration // Calculate end time in minutes

    const conflict = tasks.find(t => {
      // 1. Don't collide with itself if we are editing
      if (editingTask && t.id === editingTask.id) return false
      
      // 2. Only check blocks on the exact same day
      if (t.day !== selectedSlot.day) return false
      
      // 3. Math: Does Task A overlap with Task B?
      const tStart = t.hour * 60
      const tEnd = tStart + t.duration
      return (newStart < tEnd && newEnd > tStart)
    })

    if (conflict) {
      setError(`Time conflict detected with "${conflict.title}".`)
      // Shake animation could go here later!
      return
    }
    // -------------------------------------

    setError(null)
    onSave({
      title,
      duration: finalDuration,
      category: finalCategory || 'Other'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-sm border-t-brand/50">
        <h2 className="text-xl font-bold text-primary mb-1">
          {editingTask ? 'Edit Block' : 'Create Block'}
        </h2>
        <p className="text-sm font-medium text-brand mb-5">
          {selectedSlot.day} @ {formatHour(selectedSlot.hour)}
        </p>
        
        <input 
          type="text" 
          value={title}
          onKeyDown={handleKeyDown}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Name" 
          className="w-full bg-background border border-border rounded-xl px-4 py-3 mb-4 text-primary focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-muted/50"
          autoFocus
        />
        
        <div className="mb-4 flex flex-col gap-2">
          <select 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand/50 transition-all"
          >
            <option value="60">1 Hour</option>
            <option value="90">1.5 Hours</option>
            <option value="120">2 Hours</option>
            <option value="custom">Custom Duration...</option>
          </select>
          {duration === 'custom' && (
            <input 
              type="number" 
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder="Duration in minutes" 
              className="w-full bg-brand/5 border border-brand/20 rounded-xl px-4 py-2 text-primary text-sm focus:outline-none focus:border-brand/50"
            />
          )}
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand/50 transition-all"
          >
            <option value="Self Study">Self Study</option>
            <option value="Exam">Exam / Test</option>
            <option value="Other">Other</option>
            <option value="custom">Custom Tag...</option>
          </select>
          {category === 'custom' && (
            <input 
              type="text" 
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Custom category name" 
              className="w-full bg-brand/5 border border-brand/20 rounded-xl px-4 py-2 text-primary text-sm focus:outline-none focus:border-brand/50"
            />
          )}
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center w-full mt-2">
          {editingTask ? (
            <button 
              onClick={() => onDelete(editingTask.id)} 
              className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              Delete
            </button>
          ) : <div />}

          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-semibold text-muted hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-2 bg-brand/10 text-brand border border-brand/20 rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-all shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}