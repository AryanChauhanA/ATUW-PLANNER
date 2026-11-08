import { useMemo, useState } from 'react'
import { Activity, Flame } from 'lucide-react'

export default function ContributionGrid({ history }) {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear())

  const { gridDays, monthLabels, years, currentStreak } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentRealYear = today.getFullYear()

    // 1. Calculate available years strictly from VALID history
    const safeHistory = history || {}
    const historyYears = Object.keys(safeHistory)
      .filter(dateStr => {
        const val = safeHistory[dateStr]
        // Only count the year if there is ACTUAL completed data, ignoring empty ghost entries
        return (Array.isArray(val) && val.length > 0) || (typeof val === 'number' && val > 0)
      })
      .map(dateStr => parseInt(dateStr.split('-')[0]))
      .filter(y => !isNaN(y) && y > 2000 && y <= currentRealYear) // Sanity check boundary

    const creationYear = historyYears.length > 0 ? Math.min(...historyYears) : currentRealYear
    
    const generatedYears = []
    for(let y = currentRealYear; y >= creationYear; y--) generatedYears.push(y)

    // 2. Adjust Grid End Date based on selected year
    const endDate = new Date(today)
    if (selectedYear !== currentRealYear) {
      endDate.setFullYear(selectedYear, 11, 31)
    }

    const currentDayIdx = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1
    const totalDays = (52 * 7) + (currentDayIdx + 1)

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (totalDays - 1))

    const generatedDays = []
    const generatedMonths = []

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + i)
      generatedDays.push(d)

      if (d.getDate() === 1 && Math.floor(i / 7) < 50) {
        generatedMonths.push({
          name: d.toLocaleString('default', { month: 'short' }),
          weekIndex: Math.floor(i / 7)
        })
      }
    }

    // 3. STREAK CALCULATOR
    let streak = 0
    let checkDate = new Date(today)
    
    const getCountForDate = (dateObj) => {
      const dStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
      const raw = safeHistory[dStr]
      return Array.isArray(raw) ? raw.length : (typeof raw === 'number' ? raw : 0)
    }

    const todayCount = getCountForDate(checkDate)
    
    if (todayCount === 0) {
      checkDate.setDate(checkDate.getDate() - 1)
      if (getCountForDate(checkDate) === 0) streak = 0
    }

    if (streak !== 0 || todayCount > 0) {
      while (true) {
        if (getCountForDate(checkDate) > 0) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    return { gridDays: generatedDays, monthLabels: generatedMonths, years: generatedYears, currentStreak: streak }
  }, [history, selectedYear])

  const getHeatColor = (count) => {
    if (!count || count === 0) return 'bg-surface border-border/80'
    if (count <= 2) return 'bg-sky-900/60 border-sky-800'
    if (count <= 4) return 'bg-sky-700 border-sky-600'
    if (count <= 6) return 'bg-sky-500 border-sky-400'
    return 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-5 shadow-sm flex flex-col min-w-0">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-brand" />
          <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Consistency Map</h2>
        </div>
        
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-full shadow-sm">
            <Flame size={12} className={currentStreak > 3 ? "animate-pulse" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{currentStreak} Day Streak</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 min-w-0 w-full">
        <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-w-0">
          <div className="w-max">
            <div className="relative h-6 text-[10px] text-muted font-medium ml-8">
              {monthLabels.map((m, i) => (
                <span key={i} className="absolute bottom-1" style={{ left: `${m.weekIndex * 15}px` }}>
                  {m.name}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="grid grid-rows-7 gap-1 text-[10px] text-muted font-medium pt-1 pr-2 text-right leading-[11px]">
                <span className="row-start-1">Mon</span>
                <span className="row-start-3">Wed</span>
                <span className="row-start-5">Fri</span>
              </div>

              <div className="grid grid-flow-col grid-rows-7 gap-[4px]">
                {gridDays.map((date, idx) => {
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                  
                  const rawData = history ? history[dateStr] : null
                  let count = 0
                  if (Array.isArray(rawData)) count = rawData.length
                  else if (typeof rawData === 'number') count = rawData
                  
                  return (
                    <div 
                      key={idx}
                      title={`${count} contributions on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      className={`w-[11px] h-[11px] rounded-[2px] border ${getHeatColor(count)} transition-colors hover:border-white cursor-help`}
                    ></div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* PC Years (Now with overflow handling in case of many valid years) */}
        <div className="hidden md:flex flex-col gap-2 pl-4 border-l border-border/50 w-24 flex-shrink-0 overflow-y-auto max-h-[160px] custom-scrollbar">
          {years.map(y => (
            <button 
              key={y} 
              onClick={() => setSelectedYear(y)}
              className={`text-left text-sm px-3 py-1 rounded-lg transition-colors ${y === selectedYear ? 'bg-brand text-white font-bold' : 'text-muted hover:text-primary hover:bg-surface-hover'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Years */}
      <div className="md:hidden flex gap-2 mt-2 overflow-x-auto custom-scrollbar w-full border-t border-border/50 pt-4">
        {years.map(y => (
          <button 
            key={`mob-${y}`} 
            onClick={() => setSelectedYear(y)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-colors border ${y === selectedYear ? 'bg-brand text-white font-bold border-brand' : 'text-muted hover:text-primary hover:bg-surface-hover border-border'}`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}