import { CheckSquare, Lock, History } from 'lucide-react'

export default function DailyAgenda({ tasks, history, setHistory }) {
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

  // Safely parse tasks to prevent crashes
  const safeTasks = Array.isArray(tasks) ? tasks : []

  // Yesterday's tasks that are within the 24h trailing window
  const yesterdayTasks = safeTasks
    .filter(t => t?.day === yesterdayDayName && parseInt(t?.hour || 0) > currentHour)
    .map(t => ({ ...t, dateStr: yesterdayStr, isYesterday: true }))

  // Today's tasks
  const todayTasks = safeTasks
    .filter(t => t?.day === currentDayName)
    .map(t => ({ ...t, dateStr: todayStr, isYesterday: false }))

  // Combine and sort
  const rollingTasks = [...yesterdayTasks, ...todayTasks].sort((a, b) => {
    if (a.isYesterday && !b.isYesterday) return -1
    if (!a.isYesterday && b.isYesterday) return 1
    return (parseInt(a.hour) || 0) - (parseInt(b.hour) || 0)
  })

  const toggleTask = (id, dateStr, isLocked) => {
    if (isLocked) return

    // CRASH FIX: Ensure we are dealing with an array, not a legacy number
    const rawHistory = history[dateStr]
    const completedIds = Array.isArray(rawHistory) ? rawHistory : []
    
    let newCompleted;
    if (completedIds.includes(id)) {
      newCompleted = completedIds.filter(taskId => taskId !== id)
    } else {
      newCompleted = [...completedIds, id]
    }

    const newHistory = { ...history, [dateStr]: newCompleted }
    setHistory(newHistory)
    localStorage.setItem('atuw_history', JSON.stringify(newHistory))
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-sm flex flex-col h-full max-h-[300px] md:max-h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-brand" />
          <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Today's Agenda</h2>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-muted bg-surface border border-border/50 px-2 py-0.5 rounded uppercase" title="Includes late tasks from yesterday">
          <History size={10} /> 24H
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {rollingTasks.length === 0 ? (
          <div className="text-center mt-6 text-xs text-muted italic">No tasks in the current window.</div>
        ) : (
          rollingTasks.map(task => {
            // CRASH FIX: Parse arrays safely
            const rawHistory = history[task.dateStr]
            const completedIds = Array.isArray(rawHistory) ? rawHistory : []
            const isDone = completedIds.includes(task.id)
            
            const isLocked = !task.isYesterday && (parseInt(task.hour) * 60) > currentMinutes

            return (
              <div 
                key={`${task.dateStr}-${task.id}`}
                onClick={() => toggleTask(task.id, task.dateStr, isLocked)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                  isLocked ? 'bg-surface/30 border-border/30 opacity-60 cursor-not-allowed' :
                  isDone ? 'bg-brand/10 border-brand/30 cursor-pointer' : 
                  'bg-surface border-border hover:border-brand/50 cursor-pointer'
                }`}
              >
                <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                  isLocked ? 'border-muted/30 bg-background' :
                  isDone ? 'bg-brand border-brand' : 'border-muted'
                }`}>
                  {isDone && <CheckSquare size={10} className="text-white" />}
                  {isLocked && <Lock size={8} className="text-muted/50" />}
                </div>
                <div className={`flex flex-col min-w-0 ${isDone ? 'opacity-50 line-through' : ''}`}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-sm font-bold text-primary truncate">{task.title}</span>
                    {task.isYesterday && (
                      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Yesterday</span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted">{task.category} • {task.hour}:00</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}