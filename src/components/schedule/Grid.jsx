import { useState, useEffect, useRef } from 'react'

export default function Grid({ tasks, onSlotClick, onTaskClick, isFullView, targetHour, targetDay, startOfWeek, timeFormat }) {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let animationFrame;
    animationFrame = requestAnimationFrame(() => {
      if (scrollRef.current && !isFullView) {
        const container = scrollRef.current;
        const scrollHour = targetHour !== undefined ? parseInt(targetHour) : now.getHours();
        
        // 1. Dynamic Scroll Day Array based on Setting
        const daysArray = startOfWeek === 'Sunday' 
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          
        let scrollDayIdx = startOfWeek === 'Sunday'
          ? now.getDay()
          : (now.getDay() === 0 ? 6 : now.getDay() - 1);
        
        if (targetDay) {
          const idx = daysArray.indexOf(targetDay);
          if (idx !== -1) scrollDayIdx = idx;
        }
        
        const verticalScroll = (scrollHour * 60) - 150;
        const timeColumnWidth = 64; 
        const dayColumnWidth = (container.scrollWidth - timeColumnWidth) / 7;
        const centerOfDay = timeColumnWidth + (scrollDayIdx * dayColumnWidth) + (dayColumnWidth / 2);
        const horizontalScroll = centerOfDay - (container.clientWidth / 2);
        
        container.scrollTo({
          top: verticalScroll > 0 ? verticalScroll : 0,
          left: horizontalScroll > 0 ? horizontalScroll : 0,
          behavior: 'auto'
        });
      }
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [isFullView, targetHour, targetDay, startOfWeek, now]) // <-- Added startOfWeek to dependencies

  // 2. Dynamic Columns based on Setting
  const days = startOfWeek === 'Sunday' 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  // 3. Dynamic Current Day Index based on Setting
  const currentDayIndex = startOfWeek === 'Sunday'
    ? now.getDay()
    : (now.getDay() === 0 ? 6 : now.getDay() - 1);
    
  const currentHour = now.getHours()

  // --- HYBRID TASK ENGINE: Map this week's exact dates ---
  const currentWeekDates = {}
  const startOfWeekDate = new Date(now)
  startOfWeekDate.setHours(0,0,0,0)
  startOfWeekDate.setDate(now.getDate() - currentDayIndex) 

  days.forEach((dayStr, idx) => {
    const d = new Date(startOfWeekDate)
    d.setDate(startOfWeekDate.getDate() + idx)
    currentWeekDates[dayStr] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  
  // --- EXPIRED LOGIC: Check if a One-Time task is in the past ---
  const checkIsExpired = (task) => {
    if (task.isRoutine !== false) return false
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    
    if (task.targetDate < todayStr) return true
    if (task.targetDate === todayStr) {
      const currentMins = (now.getHours() * 60) + now.getMinutes()
      const endMins = (parseInt(task.hour) * 60) + parseInt(task.duration)
      return currentMins >= endMins
    }
    return false
  }

  const getTaskTop = (hour) => isFullView ? `${(hour / 24) * 100}%` : `${hour * 60}px`
  const getTaskHeight = (duration) => isFullView ? `${(duration / 1440) * 100}%` : `${duration}px`
  
  const totalCurrentMinutes = (currentHour * 60) + now.getMinutes()
  const getTimeLineTop = () => isFullView ? `${(totalCurrentMinutes / 1440) * 100}%` : `${totalCurrentMinutes}px`

  // 4. Dynamic Time Formatting based on Setting
  const formatHour = (h) => {
    if (timeFormat === '24h') return `${String(h).padStart(2, '0')}:00`
    
    if (h === 0) return '12 AM'
    if (h === 12) return '12 PM'
    return h > 12 ? `${h - 12} PM` : `${h} AM`
  }

  return (
    <div ref={scrollRef} className="flex-1 bg-surface backdrop-blur-xl border border-border rounded-2xl overflow-auto relative shadow-sm scroll-smooth">
      <div className={`flex flex-col relative transition-all duration-300 ${isFullView ? 'w-full h-full min-h-[400px]' : 'min-w-[800px]'}`}>
        
        <div className="sticky top-0 z-40 flex border-b border-border bg-background/80 backdrop-blur-md">
          <div className="w-16 flex-shrink-0 border-r border-border sticky left-0 z-50 bg-background/95"></div>
          {days.map((day, index) => (
            <div key={day} className="flex-1 text-center py-2 md:py-3 border-r border-border/50 last:border-r-0">
              <span className={`text-xs md:text-sm font-bold ${index === currentDayIndex ? 'text-brand' : 'text-muted'}`}>{day}</span>
            </div>
          ))}
        </div>

        <div className={`relative flex flex-col ${isFullView ? 'flex-1' : 'h-[1440px]'}`}>
          
          <div 
            className="absolute z-20 flex items-center pointer-events-none transition-all duration-1000"
            style={{ 
              top: getTimeLineTop(), 
              left: `calc(4rem + ${currentDayIndex} * ((100% - 4rem) / 7))`, 
              width: `calc((100% - 4rem) / 7)` 
            }}
          >
            <div className="w-full h-[2px] bg-brand/70 shadow-[0_0_10px_rgba(14,165,233,0.6)] relative">
              <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-brand rounded-full"></div>
            </div>
          </div>

          {tasks
            .filter(task => task.isRoutine !== false || task.targetDate === currentWeekDates[task.day])
            .map((task) => {
            const dayIndex = days.indexOf(task.day)
            let colorTheme = "bg-brand/20 border-brand/30 text-brand"
            if (task.category === 'Exam') colorTheme = "bg-red-500/20 border-red-500/30 text-red-500"
            if (task.category === 'Other') colorTheme = "bg-emerald-500/20 border-emerald-500/30 text-emerald-600"
            if (!['Exam', 'Self Study', 'Other'].includes(task.category)) {
              colorTheme = "bg-purple-500/20 border-purple-500/30 text-purple-600" 
            }

            const isExpired = checkIsExpired(task)

            return (
              <div 
                key={task.id}
                onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                className={`absolute z-10 rounded-lg border backdrop-blur-md p-1.5 md:p-2 shadow-sm flex flex-col overflow-hidden cursor-pointer transition-all ${colorTheme} ${isExpired ? 'opacity-40 grayscale hover:opacity-60' : 'hover:brightness-125'}`}
                style={{
                  top: getTaskTop(task.hour),
                  height: getTaskHeight(task.duration),
                  left: `calc(4rem + ${dayIndex} * ((100% - 4rem) / 7))`, 
                  width: `calc(((100% - 4rem) / 7) - 6px)`, 
                  marginLeft: '3px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs font-bold truncate leading-tight">{task.title}</span>
                  {task.isRoutine === false && <span className="text-[8px] md:text-[9px] opacity-70">①</span>}
                </div>
                {!isFullView && (
                  <span className="text-[9px] md:text-[10px] opacity-80 truncate mt-0.5">{task.duration}m • {task.category}</span>
                )}
              </div>
            )
          })}

          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {hours.map((hour) => (
              <div key={hour} data-hour={hour} className={`flex border-b border-border/40 group ${isFullView ? 'flex-1 min-h-0' : 'h-[60px]'}`}>
                <div className="w-16 flex-shrink-0 flex justify-center py-1 md:py-2 border-r border-border/40 sticky left-0 z-30 bg-surface/90 backdrop-blur-sm pointer-events-auto">
                  <span className={`text-[9px] md:text-[11px] font-semibold transition-colors relative md:-top-3 -top-2 ${hour === currentHour ? 'text-brand' : 'text-muted group-hover:text-primary'}`}>
                    {formatHour(hour)}
                  </span>
                </div>
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