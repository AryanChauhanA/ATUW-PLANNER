import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  // Initialize state from localStorage, or use defaults
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('atuw_username') || '')
  const [strictMode, setStrictMode] = useState(() => localStorage.getItem('atuw_strict') === 'true')
  const [audioChimes, setAudioChimes] = useState(() => localStorage.getItem('atuw_audio') !== 'false') // Default true
  const [startOfWeek, setStartOfWeek] = useState(() => localStorage.getItem('atuw_weekstart') || 'Monday')
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('atuw_timeformat') || '12h')
  const [defaultBlock, setDefaultBlock] = useState(() => localStorage.getItem('atuw_defaultblock') || '60')
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('atuw_accent') || 'cyan')
  const [aiStyle, setAiStyle] = useState(() => localStorage.getItem('atuw_aistyle') || 'Balanced')

  // Save to localStorage whenever a setting changes
  useEffect(() => { localStorage.setItem('atuw_username', displayName) }, [displayName])
  useEffect(() => { localStorage.setItem('atuw_strict', strictMode) }, [strictMode])
  useEffect(() => { localStorage.setItem('atuw_audio', audioChimes) }, [audioChimes])
  useEffect(() => { localStorage.setItem('atuw_weekstart', startOfWeek) }, [startOfWeek])
  useEffect(() => { localStorage.setItem('atuw_timeformat', timeFormat) }, [timeFormat])
  useEffect(() => { localStorage.setItem('atuw_defaultblock', defaultBlock) }, [defaultBlock])
  useEffect(() => { localStorage.setItem('atuw_aistyle', aiStyle) }, [aiStyle])
  
  // Accent Color requires applying a CSS class to the root HTML element
  useEffect(() => {
    localStorage.setItem('atuw_accent', accentColor)
    
    const root = document.documentElement // Target the HTML tag, not body
    
    // Remove all previous theme classes
    root.classList.remove('theme-cyan', 'theme-magenta', 'theme-emerald', 'theme-amber')
    
    // Add the new one (if it's not the default cyan)
    if (accentColor !== 'cyan') {
      root.classList.add(`theme-${accentColor}`)
    }
  }, [accentColor])

  return (
    <SettingsContext.Provider value={{
      displayName, setDisplayName,
      strictMode, setStrictMode,
      audioChimes, setAudioChimes,
      startOfWeek, setStartOfWeek,
      timeFormat, setTimeFormat,
      defaultBlock, setDefaultBlock,
      accentColor, setAccentColor,
      aiStyle, setAiStyle
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)