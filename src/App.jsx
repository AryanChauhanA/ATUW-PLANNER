import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import { SettingsProvider } from './contexts/SettingsContext' // <-- 1. Import the provider

function App() {
  useEffect(() => {
    try {
      const rawTasks = localStorage.getItem('atuw_tasks')
      if (rawTasks) {
        const tasks = JSON.parse(rawTasks)
        
        // Calculate the threshold date (48 hours ago)
        const threshold = new Date()
        threshold.setDate(threshold.getDate() - 2)
        const thresholdStr = `${threshold.getFullYear()}-${String(threshold.getMonth() + 1).padStart(2, '0')}-${String(threshold.getDate()).padStart(2, '0')}`

        const cleanedTasks = tasks.filter(task => {
          // 1. Keep all routine tasks
          if (task.isRoutine !== false) return true
          
          // 2. Keep one-time tasks if their date is strictly greater than or equal to the threshold
          if (task.targetDate && task.targetDate >= thresholdStr) return true
          
          // 3. Otherwise, it is older than 48 hours -> delete it
          return false
        })

        // Only write to localStorage if we actually deleted something
        if (cleanedTasks.length !== tasks.length) {
          localStorage.setItem('atuw_tasks', JSON.stringify(cleanedTasks))
          console.log(`🧹 Garbage Collector: Cleaned up ${tasks.length - cleanedTasks.length} old one-time task(s).`)
        }
      }
    } catch (error) {
      console.error("Failed to run task garbage collection:", error)
    }
  }, [])

  return (
    <SettingsProvider> {/* <-- 2. Wrap the Router */}
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </SettingsProvider>
  )
}

export default App