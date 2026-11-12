import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  // 1. Initialize state from localStorage, or use defaults
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('atuw_username') || '')
  const [strictMode, setStrictMode] = useState(() => localStorage.getItem('atuw_strict') === 'true')
  const [audioChimes, setAudioChimes] = useState(() => localStorage.getItem('atuw_audio') !== 'false')
  const [startOfWeek, setStartOfWeek] = useState(() => localStorage.getItem('atuw_weekstart') || 'Monday')
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('atuw_timeformat') || '12h')
  const [defaultBlock, setDefaultBlock] = useState(() => localStorage.getItem('atuw_defaultblock') || '60')
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('atuw_accent') || 'cyan')
  const [aiStyle, setAiStyle] = useState(() => localStorage.getItem('atuw_aistyle') || 'Balanced')

  const [isLoadedFromCloud, setIsLoadedFromCloud] = useState(false)

  // 2. Initial Cloud Pull
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase.from('user_settings').select('settings').eq('user_id', session.user.id).single()
        if (data && data.settings) {
          const s = data.settings
          if (s.displayName !== undefined) setDisplayName(s.displayName)
          if (s.strictMode !== undefined) setStrictMode(s.strictMode)
          if (s.audioChimes !== undefined) setAudioChimes(s.audioChimes)
          if (s.startOfWeek !== undefined) setStartOfWeek(s.startOfWeek)
          if (s.timeFormat !== undefined) setTimeFormat(s.timeFormat)
          if (s.defaultBlock !== undefined) setDefaultBlock(s.defaultBlock)
          if (s.accentColor !== undefined) setAccentColor(s.accentColor)
          if (s.aiStyle !== undefined) setAiStyle(s.aiStyle)
        }
      }
      setIsLoadedFromCloud(true)
    }
    fetchSettings()
  }, [])

  // 3. Local Storage Saves (Instant UI feel)
  useEffect(() => { localStorage.setItem('atuw_username', displayName) }, [displayName])
  useEffect(() => { localStorage.setItem('atuw_strict', strictMode) }, [strictMode])
  useEffect(() => { localStorage.setItem('atuw_audio', audioChimes) }, [audioChimes])
  useEffect(() => { localStorage.setItem('atuw_weekstart', startOfWeek) }, [startOfWeek])
  useEffect(() => { localStorage.setItem('atuw_timeformat', timeFormat) }, [timeFormat])
  useEffect(() => { localStorage.setItem('atuw_defaultblock', defaultBlock) }, [defaultBlock])
  useEffect(() => { localStorage.setItem('atuw_aistyle', aiStyle) }, [aiStyle])
  
  useEffect(() => {
    localStorage.setItem('atuw_accent', accentColor)
    const root = document.documentElement 
    root.classList.remove('theme-cyan', 'theme-magenta', 'theme-emerald', 'theme-amber')
    if (accentColor !== 'cyan') {
      root.classList.add(`theme-${accentColor}`)
    }
  }, [accentColor])

  // 4. Cloud Sync Engine (Debounced to prevent spamming DB on keystrokes)
  useEffect(() => {
    if (!isLoadedFromCloud) return // Prevent overwriting cloud with defaults before initial load

    const syncToCloud = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('user_settings').upsert({
          user_id: session.user.id,
          settings: {
            displayName, strictMode, audioChimes, startOfWeek,
            timeFormat, defaultBlock, accentColor, aiStyle
          }
        })
      }
    }
    
    const timeoutId = setTimeout(() => syncToCloud(), 500)
    return () => clearTimeout(timeoutId)
  }, [displayName, strictMode, audioChimes, startOfWeek, timeFormat, defaultBlock, accentColor, aiStyle, isLoadedFromCloud])

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