import { Clock, ArrowRight } from 'lucide-react'

export default function NowAndNext({ tasks }) {
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMinutes = (now.getHours() * 60) + now.getMinutes()

  const todaysTasks = (Array.isArray(tasks) ? tasks : [])
    .filter(t => t?.day === days[now.getDay()])
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

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-brand" />
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Live Status</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="flex flex-col flex-1">
          <span className="text-[10px] text-brand uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Happening Now
          </span>
          {activeTask ? (
            <div className="bg-brand/10 border border-brand/30 rounded-xl p-3 flex-1 flex flex-col justify-center">
              <h3 className="text-md font-bold text-primary">{activeTask.title}</h3>
              <p className="text-xs text-brand/80">{activeTask.category} • {activeTask.duration}m</p>
            </div>
          ) : (
            <div className="bg-surface border border-border/50 rounded-xl p-3 flex-1 flex flex-col justify-center items-center text-muted border-dashed">
              <span className="text-xs font-medium">Free block</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <span className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
            <ArrowRight size={10} /> Up Next
          </span>
          {nextTask ? (
            <div className="bg-surface border border-border rounded-xl p-3 flex-1 opacity-80 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-primary">{nextTask.title}</h3>
              <p className="text-xs text-muted">Starts at {formatTime(nextTask.hour)}</p>
            </div>
          ) : (
            <div className="bg-surface border border-border/50 rounded-xl p-3 flex-1 flex flex-col justify-center items-center text-muted border-dashed">
              <span className="text-xs font-medium">Schedule clear</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}