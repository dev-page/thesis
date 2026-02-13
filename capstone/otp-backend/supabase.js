import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL; // from Supabase dashboard → API settings
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // keep secret, use env variable

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing. Check your .env file.");
}

// Avoid logging secrets in production or developer consoles.

export const supabase = createClient(supabaseUrl, supabaseKey);