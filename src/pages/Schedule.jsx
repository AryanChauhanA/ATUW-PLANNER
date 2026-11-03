import { useState, useEffect } from 'react'
import { Sparkles, History, BarChart3 } from 'lucide-react'
import Grid from '../components/schedule/Grid'
import TaskModal from '../components/schedule/TaskModal'

export default function Schedule() {
  // 1. Load tasks from Local Storage on initial load
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('atuw_tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  // 2. Automatically save to Local Storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('atuw_tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSlotClick = (day, hour) => {
    setEditingTask(null)
    setSelectedSlot({ day, hour })
    setIsModalOpen(true)
  }

  const handleTaskClick = (task) => {
    setEditingTask(task)
    setSelectedSlot({ day: task.day, hour: task.hour })
    setIsModalOpen(true)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData } 
          : t
      ))
    } else {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        day: selectedSlot.day,
        hour: selectedSlot.hour,
        ...taskData
      }
      setTasks([...tasks, newTask])
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
    setIsModalOpen(false)
    setEditingTask(null)
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
          <button className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand text-sm font-bold rounded-xl border border-brand/20 hover:bg-brand/20 transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)]">
            <Sparkles size={16} />
            <span>AI Copilot</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary text-sm font-bold rounded-xl border border-border transition-all">
            <History size={16} />
            <span>History</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary text-sm font-bold rounded-xl border border-border transition-all">
            <BarChart3 size={16} />
            <span>Insights</span>
          </button>
        </div>
      </div>

      <Grid 
        tasks={tasks} 
        onSlotClick={handleSlotClick} 
        onTaskClick={handleTaskClick} 
      />

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }} 
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        selectedSlot={selectedSlot}
        editingTask={editingTask}
        tasks={tasks}
      />

    </div>
  )
}