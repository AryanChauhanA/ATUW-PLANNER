import { Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NowAndNext({ tasks }) {
  const navigate = useNavigate()
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMinutes = (now.getHours() * 60) + now.getMinutes()
  
  // Calculate today's exact date string (YYYY-MM-DD)
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const todaysTasks = (Array.isArray(tasks) ? tasks : [])
    .filter(t => t?.day === days[now.getDay()])
    // FILTER: Must be a routine OR the target date must match today exactly
    .filter(t => t.isRoutine !== false || t.targetDate === todayStr)
    .sort((a, b) => (parseInt(a.hour) || 0) - (parseInt(b.hour) || 0))

  const activeTask = todaysTasks.find(t => {
    const startMins = parseInt(t.hour) * 60
    const endMins = startMins + parseInt(t.duration || 60)
    return currentMinutes >= startMins && currentMinutes < endMins
  })

  const nextTask = todaysTasks.find(t => (parseInt(t.hour) * 60) > currentMinutes)

  const formatTime = (hour) => {
    const h = parseInt(hour)
    if (h === 0) return '12:00 AM'
    if (h === 12) return '12:00 PM'
    return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`
  }

  const navigateToSchedule = (task) => {
    if (task) {
      navigate('/schedule', { state: { targetHour: task.hour, targetDay: task.day } })
    }
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-5 shadow-sm flex flex-col md:h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>
      
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Clock size={16} className="text-brand" />
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Live Status</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1">
        
        {/* Happening Now */}
        <div className="flex flex-col flex-1 min-h-[110px]">
          <span className="text-[10px] text-brand uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Happening Now
          </span>
          {activeTask ? (
            <div 
              onClick={() => navigateToSchedule(activeTask)}
              className="bg-brand/10 border border-brand/30 rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-brand/20 hover:border-brand/50 hover:scale-[1.02] transition-all group"
              title="Click to view in Schedule"
            >
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 group-hover:text-brand transition-colors">
                {activeTask.isRoutine === false && "① "} {activeTask.title}
              </h3>
              <p className="text-sm text-brand/80">{activeTask.category} • {activeTask.duration}m</p>
            </div>
          ) : (
            <div className="bg-surface border border-border/50 rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-muted border-dashed">
              <span className="text-sm font-medium">Free block</span>
            </div>
          )}
        </div>

        {/* Up Next */}
        <div className="flex flex-col flex-1 min-h-[110px]">
          <span className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
            <ArrowRight size={10} /> Up Next
          </span>
          {nextTask ? (
            <div 
              onClick={() => navigateToSchedule(nextTask)}
              className="bg-surface border border-border rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-center cursor-pointer hover:border-brand/40 hover:scale-[1.02] transition-all group opacity-90 hover:opacity-100"
              title="Click to view in Schedule"
            >
              <h3 className="text-lg md:text-xl font-bold text-primary mb-1 group-hover:text-brand transition-colors">
                {nextTask.isRoutine === false && "① "} {nextTask.title}
              </h3>
              <p className="text-xs md:text-sm text-muted">Starts at {formatTime(nextTask.hour)}</p>
            </div>
          ) : (
            <div className="bg-surface border border-border/50 rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-muted border-dashed">
              <span className="text-sm font-medium">Schedule clear</span>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}