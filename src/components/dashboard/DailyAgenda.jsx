import { CheckSquare, Lock, History, AlertCircle } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'
import { playChime } from '../../utils/audio'

export default function DailyAgenda({ tasks, history, setHistory }) {
  const { strictMode, timeFormat, audioChimes } = useSettings() 
  
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinutes = (currentHour * 60) + now.getMinutes()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Today Data
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const currentDayName = days[now.getDay()]

  // Yesterday Data
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  const yesterdayDayName = days[yesterday.getDay()]

  const safeTasks = Array.isArray(tasks) ? tasks : []

  // Yesterday's tasks
  const yesterdayTasks = safeTasks
    .filter(t => t?.day === yesterdayDayName && parseInt(t?.hour || 0) > currentHour)
    .filter(t => t.isRoutine !== false || t.targetDate === yesterdayStr)
    .map(t => ({ ...t, dateStr: yesterdayStr, isYesterday: true }))

  // Today's tasks
  const todayTasks = safeTasks
    .filter(t => t?.day === currentDayName)
    .filter(t => t.isRoutine !== false || t.targetDate === todayStr)
    .map(t => ({ ...t, dateStr: todayStr, isYesterday: false }))

  // Combine and sort
  const rollingTasks = [...yesterdayTasks, ...todayTasks].sort((a, b) => {
    if (a.isYesterday && !b.isYesterday) return -1
    if (!a.isYesterday && b.isYesterday) return 1
    return (parseInt(a.hour) || 0) - (parseInt(b.hour) || 0)
  })

  const toggleTask = (id, dateStr, isFutureLocked, isStrictLocked) => {
    if (isFutureLocked || isStrictLocked) return

    const rawHistory = history[dateStr]
    const completedIds = Array.isArray(rawHistory) ? rawHistory : []
    
    let newCompleted;
    if (completedIds.includes(id)) {
      newCompleted = completedIds.filter(taskId => taskId !== id)
    } else {
      newCompleted = [...completedIds, id]
      
      // Trigger the synthetic chime from utils if the setting is ON
      if (audioChimes) {
        playChime()
      }
    }

    const newHistory = { ...history, [dateStr]: newCompleted }
    setHistory(newHistory)
    localStorage.setItem('atuw_history', JSON.stringify(newHistory))
  }

  const formatHour = (h) => {
    if (timeFormat === '24h') return `${String(h).padStart(2, '0')}:00`
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-sm flex flex-col h-full max-h-[300px] md:max-h-full relative overflow-hidden">
      
      {/* Strict Mode Glow Warning */}
      {strictMode && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-brand" />
          <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Today's Agenda</h2>
        </div>
        <div className="flex gap-2">
          {strictMode && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase" title="Anti-Procrastination Active">
              <AlertCircle size={10} /> Strict
            </div>
          )}
          <div className="flex items-center gap-1 text-[9px] font-bold text-muted bg-surface border border-border/50 px-2 py-0.5 rounded uppercase" title="Includes late tasks from yesterday">
            <History size={10} /> 24H
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 relative z-10">
        {rollingTasks.length === 0 ? (
          <div className="text-center mt-6 text-xs text-muted italic">No tasks in the current window.</div>
        ) : (
          rollingTasks.map(task => {
            const rawHistory = history[task.dateStr]
            const completedIds = Array.isArray(rawHistory) ? rawHistory : []
            const isDone = completedIds.includes(task.id)
            
            const taskStartMins = parseInt(task.hour) * 60
            const taskEndMins = taskStartMins + parseInt(task.duration || 60)

            // 1. Time State
            const isFuture = !task.isYesterday && taskStartMins > currentMinutes
            const isPast = task.isYesterday || taskEndMins < currentMinutes

            // 2. Lock State (Blocks the click)
            const isFutureLocked = isFuture
            const isStrictLocked = strictMode && isPast 

            // 3. Visual States
            const isMissed = isStrictLocked && !isDone
            const isCompletedAndLocked = isStrictLocked && isDone

            return (
              <div 
                key={`${task.dateStr}-${task.id}`}
                onClick={() => toggleTask(task.id, task.dateStr, isFutureLocked, isStrictLocked)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                  isFutureLocked ? 'bg-surface/30 border-border/30 opacity-60 cursor-not-allowed' :
                  isMissed ? 'bg-red-500/5 border-red-500/20 opacity-75 cursor-not-allowed grayscale' :
                  isCompletedAndLocked ? 'bg-brand/10 border-brand/30 cursor-not-allowed opacity-90' :
                  isDone ? 'bg-brand/10 border-brand/30 cursor-pointer hover:brightness-110' : 
                  'bg-surface border-border hover:border-brand/50 cursor-pointer'
                }`}
              >
                <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                  isFutureLocked ? 'border-muted/30 bg-background' :
                  isMissed ? 'border-red-500/30 bg-red-500/10' :
                  isDone ? 'bg-brand border-brand' : 'border-muted'
                }`}>
                  {isDone && <CheckSquare size={10} className="text-white" />}
                  {isFutureLocked && <Lock size={8} className="text-muted/50" />}
                  {isMissed && <AlertCircle size={10} className="text-red-500/70" />}
                </div>
                <div className={`flex flex-col min-w-0 w-full ${isDone ? 'opacity-50 line-through' : ''}`}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className={`text-sm font-bold truncate ${isMissed ? 'text-muted' : 'text-primary'}`}>
                      {task.isRoutine === false && <span className="text-amber-500 mr-1">①</span>} {task.title}
                    </span>
                    {task.isYesterday && !isStrictLocked && (
                      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Yesterday</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-muted">
                      {task.category} • {formatHour(task.hour)}
                    </span>
                    
                    {/* Status Tags */}
                    {isMissed && (
                      <span className="text-[9px] text-red-500/70 font-bold uppercase tracking-widest">Missed</span>
                    )}
                    {isCompletedAndLocked && (
                      <span className="flex items-center gap-1 text-[9px] text-brand font-bold uppercase tracking-widest">
                        <Lock size={8} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}