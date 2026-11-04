import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Notes from './pages/Notes'
import Settings from './pages/Settings' // <-- New Import

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} /> {/* <-- New Route */}
        </Routes>
      </DashboardLayout>
    </Router>
  )
}

export default App