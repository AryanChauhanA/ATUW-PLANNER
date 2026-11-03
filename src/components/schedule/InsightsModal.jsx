import { BarChart3 } from 'lucide-react'

export default function InsightsModal({ isOpen, onClose, tasks }) {
  if (!isOpen) return null

  // Math Engine: Calculate total minutes per category
  const stats = tasks.reduce((acc, task) => {
    const cat = task.category || 'Other'
    acc[cat] = (acc[cat] || 0) + task.duration
    acc.total = (acc.total || 0) + task.duration
    return acc
  }, { total: 0 })

  // Helper to convert minutes to "Xh Ym"
  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m > 0 ? m + 'm' : '0m'}`
  }

  // Pre-defined colors for standard categories, with a fallback for custom ones
  const getCategoryColor = (cat) => {
    if (cat === 'Exam') return 'bg-red-500'
    if (cat === 'Self Study') return 'bg-brand'
    if (cat === 'Other') return 'bg-emerald-500'
    return 'bg-purple-500'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-sm border-t-brand/50 flex flex-col">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand/10 text-brand rounded-lg">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Weekly Insights</h2>
            <p className="text-sm font-medium text-muted mt-0.5">Total Time: {formatTime(stats.total)}</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 mb-8">
          {Object.entries(stats).map(([category, minutes]) => {
            if (category === 'total') return null
            
            // Calculate percentage for the visual bar
            const percentage = stats.total > 0 ? (minutes / stats.total) * 100 : 0

            return (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-primary">{category}</span>
                  <span className="font-medium text-muted">{formatTime(minutes)}</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getCategoryColor(category)}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
          
          {Object.keys(stats).length <= 1 && (
            <div className="text-center text-muted text-sm italic py-4">
              Add tasks to your schedule to see insights.
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-surface text-primary border border-border rounded-xl text-sm font-bold hover:bg-surface-hover transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}