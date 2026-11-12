import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, History, BarChart3, Shrink } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { supabase } from '../lib/supabase'

import Grid from '../components/schedule/Grid'
import TaskModal from '../components/schedule/TaskModal'
import HistoryModal from '../components/schedule/HistoryModal' 
import InsightsModal from '../components/schedule/InsightsModal'

export default function Schedule() {
  const location = useLocation()
  const { targetHour, targetDay } = location.state || {}

  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [isFullView, setIsFullView] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false) 
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  
  const { startOfWeek, timeFormat, defaultBlock } = useSettings()

  // 1. Initial State Load
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('atuw_tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  // NEW: The Cloud Lock to prevent the Resurrection Bug
  const [isLoadedFromCloud, setIsLoadedFromCloud] = useState(false)

  // 2. Initial Cloud Pull
  useEffect(() => {
    const fetchCloudTasks = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsLoadedFromCloud(true) // Unlock if offline
        return
      }

      const { data, error } = await supabase.from('tasks').select('*')
      if (!error && data) {
        const formattedData = data.map(dbTask => ({
          ...dbTask.metadata,
          id: dbTask.id,
          day: dbTask.day,
          hour: dbTask.hour,
          duration: dbTask.duration || parseInt(defaultBlock) || 1,
          isRoutine: dbTask.is_routine,
          targetDate: dbTask.target_date,
          completed: dbTask.completed,
        }))
        
        setTasks(formattedData)
        localStorage.setItem('atuw_tasks', JSON.stringify(formattedData))
      }
      setIsLoadedFromCloud(true) // UNLOCK THE UPLOAD ENGINE AFTER DOWNLOADING
    }
    fetchCloudTasks()
  }, [defaultBlock])

  // 3. The Cloud Sync Engine
  const syncWithCloud = useCallback(async (currentLocalTasks) => {
    localStorage.setItem('atuw_tasks', JSON.stringify(currentLocalTasks))

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const cloudReadyTasks = currentLocalTasks.map(task => ({
        id: task.id,
        user_id: session.user.id,
        day: task.day,
        hour: task.hour,
        duration: task.duration || parseInt(defaultBlock) || 1,
        is_routine: task.isRoutine !== undefined ? task.isRoutine : (task.is_routine ?? true),
        target_date: task.targetDate || task.target_date || null,
        completed: task.completed || false,
        text: task.title || task.text || 'task',
        metadata: task 
      }))

      if (cloudReadyTasks.length > 0) {
        await supabase.from('tasks').upsert(cloudReadyTasks, { onConflict: 'id' })
      }
    } catch (error) {
      console.error("Sync Engine Error:", error)
    }
  }, [defaultBlock])

  // 4. Trigger Sync ONLY if unlocked
  useEffect(() => {
    if (!isLoadedFromCloud) return // BLOCKS STALE UPLOADS
    syncWithCloud(tasks)
  }, [tasks, syncWithCloud, isLoadedFromCloud])

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
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t))
    } else {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        day: selectedSlot.day,
        hour: selectedSlot.hour,
        duration: parseInt(defaultBlock),
        ...taskData
      }
      setTasks([...tasks, newTask])
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
    setIsModalOpen(false)
    setEditingTask(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('tasks').delete().eq('id', taskId)
    }
  }

  const handleLoadSnapshot = (snapshotTasks) => setTasks(snapshotTasks)

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full pb-8">
      
      <div className="mb-4 flex flex-row justify-between items-center gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-primary tracking-tight">Weekly Plan</h1>
          <p className="hidden md:block text-muted text-sm font-medium mt-1 uppercase tracking-widest">
            24x7 Schedule Canvas
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center justify-center p-2.5 md:px-4 md:py-2 bg-brand/10 text-brand md:text-sm font-bold rounded-xl border border-brand/20 hover:bg-brand/20 transition-all shadow-sm">
            <Sparkles size={18} />
            <span className="hidden md:inline ml-2">AI Copilot</span>
          </button>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center justify-center p-2.5 md:px-4 md:py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary md:text-sm font-bold rounded-xl border border-border transition-all"
          >
            <History size={18} />
            <span className="hidden md:inline ml-2">History</span>
          </button>
          
          <button 
            onClick={() => setIsInsightsOpen(true)}
            className="flex items-center justify-center p-2.5 md:px-4 md:py-2 bg-surface hover:bg-surface-hover text-muted hover:text-primary md:text-sm font-bold rounded-xl border border-border transition-all"
          >
            <BarChart3 size={18} />
            <span className="hidden md:inline ml-2">Insights</span>
          </button>

          <button 
            onClick={() => setIsFullView(!isFullView)}
            className={`md:hidden flex items-center justify-center p-2.5 hover:bg-surface-hover font-bold rounded-xl border transition-all ${isFullView ? 'bg-brand/10 text-brand border-brand/30' : 'bg-surface text-muted hover:text-primary border-border'}`}
          >
            <Shrink size={18} />
          </button>
        </div>
      </div>

      <Grid 
        tasks={tasks} 
        onSlotClick={handleSlotClick} 
        onTaskClick={handleTaskClick}
        isFullView={isFullView}
        targetHour={targetHour}
        targetDay={targetDay}
        startOfWeek={startOfWeek} 
        timeFormat={timeFormat} 
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
        defaultDuration={parseInt(defaultBlock)} 
      />

      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        currentTasks={tasks}
        onLoadSnapshot={handleLoadSnapshot}
      />

      <InsightsModal 
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        tasks={tasks}
      />

    </div>
  )
}