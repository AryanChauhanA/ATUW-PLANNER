import { useState, useEffect } from 'react'
import { UserCircle } from 'lucide-react'
import logo from '../../assets/logo.png' 

export default function WelcomeHeader({ openSignIn }) {
  const [time, setTime] = useState(new Date())
  const [name, setName] = useState(() => localStorage.getItem('atuw_username') || '')
  const [inputName, setInputName] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSaveName = (e) => {
    e.preventDefault()
    if (inputName.trim()) {
      localStorage.setItem('atuw_username', inputName.trim())
      setName(inputName.trim())
    }
  }

  const hour = time.getHours()
  let greeting = `Good evening, ${name}.`
  if (hour >= 0 && hour < 5) greeting = `Late night, ${name}?`
  else if (hour >= 5 && hour < 12) greeting = `Good morning, ${name}.`
  else if (hour >= 12 && hour < 17) greeting = `Good afternoon, ${name}.`

  return (
    <div className="flex items-center justify-between bg-surface/30 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile GitHub Logo */}
        <a href="https://github.com/AryanChauhanA/ATUW-PLANNER" target="_blank" rel="noreferrer" className="md:hidden">
          <img src={logo} alt="ATUW" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
        </a>

        <div>
          {!name ? (
            <form onSubmit={handleSaveName} className="flex flex-col gap-2">
              <h1 className="text-xl font-extrabold text-primary">Welcome.</h1>
              <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="What is your name?"
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand w-max"
              />
            </form>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight">{greeting}</h1>
              <p className="text-sm font-medium text-brand uppercase tracking-widest mt-1">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Universal Sign-In Button */}
      <button 
        onClick={openSignIn}
        className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl hover:bg-surface-hover transition-colors text-muted hover:text-brand"
      >
        <UserCircle size={22} />
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Sign In</span>
      </button>
    </div>
  )
}