import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Instant Memory Check (Local Storage)
    const storedTheme = localStorage.getItem('atuw-theme')
    if (storedTheme) return storedTheme
    // 2. System Default Check
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })

  useEffect(() => {
    // Apply the theme to the actual HTML document so Tailwind triggers
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Save to local storage for instant load next time
    localStorage.setItem('atuw-theme', theme)

    // TODO [Firebase]: Push 'theme' variable to Firestore user document here
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to easily grab the theme anywhere in the app
export const useTheme = () => useContext(ThemeContext)