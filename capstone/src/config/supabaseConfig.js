import { createClient } from '@supabase/supabase-js'

// Vite injects env vars prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anon key is missing. Check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)