import { createClient } from '@supabase/supabase-js'

// Grab the variables from our .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the database client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)