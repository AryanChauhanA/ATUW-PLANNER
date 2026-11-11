import { useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import { playCreate } from '../../utils/audio'

export default function TaskModal({ isOpen, onClose, onSave, onDelete, selectedSlot, editingTask, tasks, defaultDuration }) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('60')
  const [customDuration, setCustomDuration] = useState('')
  const [category, setCategory] = useState('Self Study')
  const [customCategory, setCustomCategory] = useState('')
  const [isRoutine, setIsRoutine] = useState(true)
  const [error, setError] = useState(null) 
  
  // Pull audio preference from global context
  const { audioChimes } = useSettings()

  useEffect(() => {
    if (isOpen) {
      setError(null) 
      if (editingTask) {
        setTitle(editingTask.title)
        setIsRoutine(editingTask.isRoutine !== false) 
        
        const standardDurations = ['30', '45', '60', '90', '120']
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
        // Use the defaultDuration passed from SettingsContext
        const initialDur = defaultDuration ? defaultDuration.toString() : '60'
        
        const standardDurations = ['30', '45', '60', '90', '120']
        if (standardDurations.includes(initialDur)) {
          setDuration(initialDur)
          setCustomDuration('')
        } else {
          setDuration('custom')
          setCustomDuration(initialDur)
        }
        
        setCategory('Self Study')
        setCustomCategory('')
        setIsRoutine(true)
      }
    }
  }, [isOpen, editingTask, defaultDuration])

  if (!isOpen || !selectedSlot) return null

  const formatHour = (h) => {
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  const calculateTargetDate = (targetDayStr) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const targetDayNum = days.indexOf(targetDayStr)
    const now = new Date()
    const currentDayNum = now.getDay()

    let daysToAdd = (targetDayNum - currentDayNum + 7) % 7
    
    if (daysToAdd === 0) {
      const currentMinutes = (now.getHours() * 60) + now.getMinutes()
      const taskStartMinutes = selectedSlot.hour * 60
      const currentDur = duration === 'custom' ? parseInt(customDuration || 0) : parseInt(duration || 0)
      const taskEndMinutes = taskStartMinutes + currentDur
      
      if (currentMinutes >= taskEndMinutes) {
        daysToAdd = 7
      }
    }
    
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + daysToAdd)
    
    return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
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

    const newStart = selectedSlot.hour * 60 
    const newEnd = newStart + finalDuration 

    const conflict = tasks.find(t => {
      if (editingTask && t.id === editingTask.id) return false
      if (t.day !== selectedSlot.day) return false
      
      const tStart = t.hour * 60
      const tEnd = tStart + t.duration
      return (newStart < tEnd && newEnd > tStart)
    })

    if (conflict) {
      setError(`Time conflict detected with "${conflict.title}".`)
      return
    }

    setError(null)
    
    // 🔥 SUCCESS MOMENT: Play the create pop chime before saving!
    if (audioChimes) {
      playCreate()
    }
    
    onSave({
      title,
      duration: finalDuration,
      category: finalCategory || 'Other',
      isRoutine,
      targetDate: isRoutine ? null : (editingTask && editingTask.targetDate ? editingTask.targetDate : calculateTargetDate(selectedSlot.day))
    })
  }

  const targetDatePreview = !isRoutine ? (editingTask && editingTask.targetDate ? editingTask.targetDate : calculateTargetDate(selectedSlot.day)) : null

  // --- UX: Check if the preview date falls outside the current week's grid ---
  let isNextWeek = false;
  if (targetDatePreview) {
    const now = new Date();
    const currentDayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0, Sun=6
    
    const thisSunday = new Date(now);
    thisSunday.setDate(now.getDate() + (6 - currentDayIdx)); // Fast-forward to this week's Sunday
    const thisSundayStr = `${thisSunday.getFullYear()}-${String(thisSunday.getMonth() + 1).padStart(2, '0')}-${String(thisSunday.getDate()).padStart(2, '0')}`;
    
    // If the target date is mathematically greater than this week's Sunday, it's next week!
    isNextWeek = targetDatePreview > thisSundayStr;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-sm border-t-brand/50">
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">
              {editingTask ? 'Edit Block' : 'Create Block'}
            </h2>
            <p className="text-sm font-medium text-brand">
              {selectedSlot.day} @ {formatHour(selectedSlot.hour)}
            </p>
          </div>
        </div>

        <div className="flex bg-background border border-border rounded-xl p-1 mb-4">
          <button 
            type="button"
            onClick={() => setIsRoutine(true)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${isRoutine ? 'bg-brand/10 text-brand' : 'text-muted hover:text-primary'}`}
          >
            🔁 Routine
          </button>
          <button 
            type="button"
            onClick={() => setIsRoutine(false)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!isRoutine ? 'bg-amber-500/10 text-amber-500' : 'text-muted hover:text-primary'}`}
          >
            ① One-Time
          </button>
        </div>

        {!isRoutine && (
          <div className="mb-4 flex flex-col items-center bg-amber-500/5 border border-amber-500/20 rounded-xl p-2.5">
            <p className="text-[11px] text-amber-500/90 font-bold uppercase tracking-wider text-center">
              Appears on {new Date(targetDatePreview).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            {isNextWeek && (
              <p className="text-[10px] text-amber-600/80 text-center mt-1.5 font-medium leading-tight px-2">
                ⚠️ Scheduled for next week. It will remain hidden from your current weekly grid until then.
              </p>
            )}
          </div>
        )}
        
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
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
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

          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={onClose} 
              className="px-3 md:px-4 py-2 text-sm font-semibold text-muted hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-5 md:px-6 py-2 bg-brand/10 text-brand border border-brand/20 rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-all shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}