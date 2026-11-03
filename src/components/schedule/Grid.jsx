import { useState, useEffect, useRef } from 'react'

export default function Grid({ tasks, onSlotClick, onTaskClick }) {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollPosition = (now.getHours() * 60) - 150
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

  return (
    <div ref={scrollRef} className="flex-1 bg-surface backdrop-blur-xl border border-border rounded-2xl overflow-y-auto relative shadow-sm scroll-smooth flex flex-col">
      <div className="sticky top-0 z-30 flex border-b border-border bg-background/80 backdrop-blur-md">
        <div className="w-16 flex-shrink-0 border-r border-border"></div>
        {days.map((day, index) => (
          <div key={day} className="flex-1 text-center py-3 border-r border-border/50 last:border-r-0">
            <span className={`text-sm font-bold ${index === currentDayIndex ? 'text-brand' : 'text-muted'}`}>{day}</span>
          </div>
        ))}
      </div>

      <div className="relative min-h-[1440px]"> 
        <div 
          className="absolute z-20 flex items-center pointer-events-none transition-all duration-1000"
          style={{ top: calculateTimeLineTop(), left: `calc(4rem + ${currentDayIndex} * ((100% - 4rem) / 7))`, width: `calc((100% - 4rem) / 7)` }}
        >
          <div className="w-full h-[2px] bg-brand/70 shadow-[0_0_10px_rgba(14,165,233,0.6)] relative">
            <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full"></div>
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full"></div>
          </div>
        </div>

        {tasks.map((task) => {
          const dayIndex = days.indexOf(task.day)
          let colorTheme = "bg-brand/20 border-brand/30 text-brand"
          if (task.category === 'Exam') colorTheme = "bg-red-500/20 border-red-500/30 text-red-500"
          if (task.category === 'Other') colorTheme = "bg-emerald-500/20 border-emerald-500/30 text-emerald-600"
          if (!['Exam', 'Self Study', 'Other'].includes(task.category)) {
            colorTheme = "bg-purple-500/20 border-purple-500/30 text-purple-600" 
          }

          return (
            <div 
              key={task.id}
              onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
              className={`absolute z-10 rounded-lg border backdrop-blur-md p-2 shadow-sm flex flex-col overflow-hidden cursor-pointer hover:brightness-125 transition-all ${colorTheme}`}
              style={{
                top: `${task.hour * 60}px`, height: `${task.duration}px`,
                left: `calc(4rem + ${dayIndex} * ((100% - 4rem) / 7))`, width: `calc(((100% - 4rem) / 7) - 6px)`, marginLeft: '3px'
              }}
            >
              <span className="text-xs font-bold truncate">{task.title}</span>
              <span className="text-[10px] opacity-80 truncate mt-0.5">{task.duration}m • {task.category}</span>
            </div>
          )
        })}

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
                    onClick={() => onSlotClick(day, hour)}
                    className={`flex-1 border-r border-border/20 last:border-r-0 relative hover:bg-brand/5 transition-colors cursor-crosshair ${isCurrentBlock ? 'bg-brand/5' : ''}`}
                  ></div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}