import { useState, useEffect, useRef } from 'react'

export default function Grid({ tasks, onSlotClick, onTaskClick, isFullView }) {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Bulletproof Dual-Axis Scroll (requestAnimationFrame Fix)
  useEffect(() => {
    let animationFrame;
    
    // Wait for the browser to finish its native paint cycle
    animationFrame = requestAnimationFrame(() => {
      if (scrollRef.current && !isFullView) {
        const container = scrollRef.current;
        
        // Vertical Scroll: Center current time
        const verticalScroll = (now.getHours() * 60) - 150;
        
        // Horizontal Scroll: Center current day (if on a narrow screen)
        const currentDayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
        const timeColumnWidth = 64; 
        const dayColumnWidth = (container.scrollWidth - timeColumnWidth) / 7;
        
        const centerOfDay = timeColumnWidth + (currentDayIdx * dayColumnWidth) + (dayColumnWidth / 2);
        const horizontalScroll = centerOfDay - (container.clientWidth / 2);
        
        // Use native scrollTo with 'auto' to instantly snap, ignoring CSS smooth scrolling
        container.scrollTo({
          top: verticalScroll > 0 ? verticalScroll : 0,
          left: horizontalScroll > 0 ? horizontalScroll : 0,
          behavior: 'auto'
        });
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isFullView]) // Removed 'now' to prevent scrolling from hijacking the user every 60 seconds

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
  const currentHour = now.getHours()

  // Hybrid Math Engine (Pixels for Normal, Percentages for Full View)
  const getTaskTop = (hour) => isFullView ? `${(hour / 24) * 100}%` : `${hour * 60}px`
  const getTaskHeight = (duration) => isFullView ? `${(duration / 1440) * 100}%` : `${duration}px`
  
  const totalCurrentMinutes = (currentHour * 60) + now.getMinutes()
  const getTimeLineTop = () => isFullView ? `${(totalCurrentMinutes / 1440) * 100}%` : `${totalCurrentMinutes}px`

  const formatHour = (h) => {
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  return (
    // Outer Container: Enables scrolling
    <div ref={scrollRef} className="flex-1 bg-surface backdrop-blur-xl border border-border rounded-2xl overflow-auto relative shadow-sm scroll-smooth">
      
      {/* Width Wrapper: Squeezes to screen in Full View, stays 800px min in Normal View */}
      <div className={`flex flex-col relative transition-all duration-300 ${isFullView ? 'w-full h-full min-h-[400px]' : 'min-w-[800px]'}`}>
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 flex border-b border-border bg-background/80 backdrop-blur-md">
          <div className="w-16 flex-shrink-0 border-r border-border sticky left-0 z-50 bg-background/95"></div>
          {days.map((day, index) => (
            <div key={day} className="flex-1 text-center py-2 md:py-3 border-r border-border/50 last:border-r-0">
              <span className={`text-xs md:text-sm font-bold ${index === currentDayIndex ? 'text-brand' : 'text-muted'}`}>{day}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Body: h-full for Full View, h-[1440px] for Normal View */}
        <div className={`relative flex flex-col ${isFullView ? 'flex-1' : 'h-[1440px]'}`}>
          
          {/* Current Time Line */}
          <div 
            className="absolute z-20 flex items-center pointer-events-none transition-all duration-1000"
            style={{ top: getTimeLineTop(), left: `calc(4rem + ${currentDayIndex} * ((100% - 4rem) / 7))`, width: `calc((100% - 4rem) / 7)` }}
          >
            <div className="w-full h-[2px] bg-brand/70 shadow-[0_0_10px_rgba(14,165,233,0.6)] relative">
              <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full"></div>
            </div>
          </div>

          {/* Render Tasks */}
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
                className={`absolute z-10 rounded-lg border backdrop-blur-md p-1.5 md:p-2 shadow-sm flex flex-col overflow-hidden cursor-pointer hover:brightness-125 transition-all ${colorTheme}`}
                style={{
                  top: getTaskTop(task.hour),
                  height: getTaskHeight(task.duration),
                  left: `calc(4rem + ${dayIndex} * ((100% - 4rem) / 7))`, 
                  width: `calc(((100% - 4rem) / 7) - 6px)`, 
                  marginLeft: '3px'
                }}
              >
                <span className="text-[10px] md:text-xs font-bold truncate leading-tight">{task.title}</span>
                {!isFullView && (
                  <span className="text-[9px] md:text-[10px] opacity-80 truncate mt-0.5">{task.duration}m • {task.category}</span>
                )}
              </div>
            )
          })}

          {/* Background Grid Slots */}
          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {hours.map((hour) => (
              <div key={hour} className={`flex border-b border-border/40 group ${isFullView ? 'flex-1 min-h-0' : 'h-[60px]'}`}>
                {/* Time Axis */}
                <div className="w-16 flex-shrink-0 flex justify-center py-1 md:py-2 border-r border-border/40 sticky left-0 z-30 bg-surface/90 backdrop-blur-sm pointer-events-auto">
                  <span className={`text-[9px] md:text-[11px] font-semibold transition-colors relative md:-top-3 -top-2 ${hour === currentHour ? 'text-brand' : 'text-muted group-hover:text-primary'}`}>
                    {formatHour(hour)}
                  </span>
                </div>
                {/* Grid Slots */}
                {days.map((day, dayIndex) => {
                  const isCurrentBlock = hour === currentHour && dayIndex === currentDayIndex;
                  return (
                    <div 
                      key={`${day}-${hour}`} 
                      onClick={() => onSlotClick(day, hour)}
                      className={`flex-1 border-r border-border/20 last:border-r-0 relative hover:bg-brand/5 transition-colors cursor-crosshair pointer-events-auto ${isCurrentBlock ? 'bg-brand/5' : ''}`}
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}