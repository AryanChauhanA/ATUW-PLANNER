import { useState, useEffect } from 'react'
import { User, Cloud, LogOut } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'
import { supabase } from '../../lib/supabase'

export default function AccountSettings() {
  const { displayName, setDisplayName } = useSettings()
  
  // Auth State
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Listen for login status
  useEffect(() => {
    // 1. Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsAuthLoading(false)
    })

    // 2. Listen for clicks on login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <User size={18} className="text-brand" />
        <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Account</h2>
      </div>
      
      <div className="space-y-4">
        {/* Display Name Input */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Display Name</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-brand/50 transition-all"
            placeholder="What should we call you?"
          />
        </div>

        {/* Cloud Sync & Auth Section */}
        <div className="pt-2">
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Cloud Sync</label>
          
          {isAuthLoading ? (
            <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-center h-[120px]">
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : user ? (
            /* --- LOGGED IN STATE --- */
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">
                    {user.user_metadata?.full_name || 'Authenticated User'}
                  </span>
                  <span className="text-xs text-muted">{user.email}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold rounded-xl hover:bg-red-500/20 transition-colors w-full"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            /* --- LOGGED OUT STATE --- */
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
              <Cloud size={24} className="text-muted/50" />
              <p className="text-xs text-muted">Sign in to sync your schedule across devices and backup your streaks.</p>
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-sm w-full"
              >
                {/* Google G Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}