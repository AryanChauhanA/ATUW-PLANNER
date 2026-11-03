import { useState, useEffect, useRef } from 'react'

export default function Schedule() {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)
  
  // Data State (Will sync with Local Storage later)
  const [tasks, setTasks] = useState([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('60')
  const [customDuration, setCustomDuration] = useState('')
  const [category, setCategory] = useState('Self Study')
  const [customCategory, setCustomCategory] = useState('')

  // Real-time clock update
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to current time on load
  useEffect(() => {
    if (scrollRef.current) {
      const scrollPosition = (now.getHours() * 60) - 150 // 150px offset to center it
      scrollRef.current.scrollTop = scrollPosition > 0 ? scrollPosition : 0
    }
  }, [])

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
  const currentHour = now.getHours()

  const calculateTimeLineTop = () => {
    const totalMinutes = (currentHour * 60) + now.getMinutes()
    return `${(totalMinutes / 1440) * 100}%`
  }

  const formatHour = (h) => {
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  const handleSlotClick = (day, hour) => {
    setTitle('')
    setDuration('60')
    setCustomDuration('')
    setCategory('Self Study')
    setCustomCategory('')
    setSelectedSlot({ day, hour })
    setIsModalOpen(true)
  }

  const handleSaveTask = () => {
    if (!title.trim()) return

    const finalDuration = duration === 'custom' ? parseInt(customDuration) : parseInt(duration)
    const finalCategory = category === 'custom' ? customCategory : category

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      day: selectedSlot.day,
      hour: selectedSlot.hour,
      title,
      duration: finalDuration || 60, // fallback to 60 if custom is empty
      category: finalCategory || 'Other'
    }

    setTasks([...tasks, newTask])
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full pb-8">
      
      {/* Header & Controls */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Weekly Plan</h1>
          <p className="text-muted text-sm font-medium mt-1 uppercase tracking-widest">
            24x7 Schedule Canvas
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-brand/10 text-brand text-sm font-bold rounded-xl border border-brand/20 hover:bg-brand/20 transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)]">
            ✨ AI Edit
          </button>
          <button className="px-4 py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary text-sm font-bold rounded-xl border border-border transition-all">
            Versions
          </button>
          <button className="px-4 py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary text-sm font-bold rounded-xl border border-border transition-all">
            📊 Stats
          </button>
        </div>
      </div>

      {/* Grid Canvas Wrapper */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-surface backdrop-blur-xl border border-border rounded-2xl overflow-y-auto relative shadow-sm scroll-smooth flex flex-col"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 flex border-b border-border bg-background/80 backdrop-blur-md">
          <div className="w-16 flex-shrink-0 border-r border-border"></div>
          {days.map((day, index) => (
            <div key={day} className="flex-1 text-center py-3 border-r border-border/50 last:border-r-0">
              <span className={`text-sm font-bold ${index === currentDayIndex ? 'text-brand' : 'text-muted'}`}>
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Grid Body */}
        <div className="relative min-h-[1440px]"> 
          
          {/* Luminous "Now" Indicator */}
          <div 
            className="absolute z-20 flex items-center pointer-events-none transition-all duration-1000"
            style={{ 
              top: calculateTimeLineTop(),
              left: `calc(4rem + ${currentDayIndex} * ((100% - 4rem) / 7))`, 
              width: `calc((100% - 4rem) / 7)`
            }}
          >
            <div className="w-full h-[2px] bg-brand/70 shadow-[0_0_10px_rgba(14,165,233,0.6)] relative">
              <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full shadow-[0_0_12px_rgba(14,165,233,1)]"></div>
              <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full shadow-[0_0_12px_rgba(14,165,233,1)]"></div>
            </div>
          </div>

          {/* Render Saved Tasks as Floating Blocks */}
          {tasks.map((task) => {
            const dayIndex = days.indexOf(task.day)
            
            // Assign colors based on category
            let colorTheme = "bg-brand/20 border-brand/30 text-brand" // Default (Self Study/Brand)
            if (task.category === 'Exam') colorTheme = "bg-red-500/20 border-red-500/30 text-red-500 dark:text-red-400"
            if (task.category === 'Other') colorTheme = "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            if (task.category !== 'Exam' && task.category !== 'Self Study' && task.category !== 'Other') {
              colorTheme = "bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400" // Custom Category
            }

            return (
              <div 
                key={task.id}
                className={`absolute z-10 rounded-lg border backdrop-blur-md p-2 shadow-sm flex flex-col overflow-hidden cursor-pointer hover:brightness-110 transition-all ${colorTheme}`}
                style={{
                  top: `${task.hour * 60}px`,
                  height: `${task.duration}px`,
                  left: `calc(4rem + ${dayIndex} * ((100% - 4rem) / 7))`,
                  width: `calc(((100% - 4rem) / 7) - 6px)`,
                  marginLeft: '3px'
                }}
              >
                <span className="text-xs font-bold truncate">{task.title}</span>
                <span className="text-[10px] opacity-80 truncate mt-0.5">
                  {task.duration}m • {task.category}
                </span>
              </div>
            )
          })}

          {/* The 24-Hour Dropzone Grid */}
          <div className="absolute inset-0">
            {hours.map((hour) => (
              <div key={hour} className="flex border-b border-border/40 group h-[60px]">
                <div className="w-16 flex-shrink-0 flex justify-center py-2 border-r border-border/40">
                  <span className={`text-[11px] font-semibold transition-colors relative -top-3 ${hour === currentHour ? 'text-brand' : 'text-muted group-hover:text-primary'}`}>
                    {formatHour(hour)}
                  </span>
                </div>
                
                {days.map((day, dayIndex) => {
                  const isCurrentBlock = hour === currentHour && dayIndex === currentDayIndex;
                  return (
                    <div 
                      key={`${day}-${hour}`} 
                      onClick={() => handleSlotClick(day, hour)}
                      className={`flex-1 border-r border-border/20 last:border-r-0 relative hover:bg-brand/5 transition-colors cursor-crosshair ${
                        isCurrentBlock ? 'bg-brand/5 shadow-[inset_0_0_15px_rgba(14,165,233,0.1)]' : ''
                      }`}
                    >
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-sm border-t-brand/50">
            <h2 className="text-xl font-bold text-primary mb-1">Create Block</h2>
            <p className="text-sm font-medium text-brand mb-5">
              {selectedSlot.day} @ {formatHour(selectedSlot.hour)}
            </p>
            
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Name" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 mb-4 text-primary focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-muted/50"
              autoFocus
            />
            
            {/* Duration Select & Custom Input */}
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
                  placeholder="Duration in minutes (e.g., 45)" 
                  className="w-full bg-brand/5 border border-brand/20 rounded-xl px-4 py-2 text-primary text-sm focus:outline-none focus:border-brand/50"
                />
              )}
            </div>

            {/* Category Select & Custom Input */}
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

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTask} 
                className="px-6 py-2 bg-brand/10 text-brand border border-brand/20 rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-all shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}