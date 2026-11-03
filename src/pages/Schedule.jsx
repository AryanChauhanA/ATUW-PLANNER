import { useState } from 'react'
import { Sparkles, History, BarChart3 } from 'lucide-react'
import Grid from '../components/schedule/Grid'
import TaskModal from '../components/schedule/TaskModal'

export default function Schedule() {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  // New state to track if we are editing an existing block
  const [editingTask, setEditingTask] = useState(null)

  // Click empty slot -> Create New
  const handleSlotClick = (day, hour) => {
    setEditingTask(null)
    setSelectedSlot({ day, hour })
    setIsModalOpen(true)
  }

  // Click existing block -> Edit
  const handleTaskClick = (task) => {
    setEditingTask(task)
    setSelectedSlot({ day: task.day, hour: task.hour })
    setIsModalOpen(true)
  }

  // Save (Handles both Create and Update)
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task in the array
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData } 
          : t
      ))
    } else {
      // Create brand new task
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

  // Delete logic
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

      {/* The Visual Canvas */}
      <Grid 
        tasks={tasks} 
        onSlotClick={handleSlotClick} 
        onTaskClick={handleTaskClick} 
      />

      {/* The Input Modal */}
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