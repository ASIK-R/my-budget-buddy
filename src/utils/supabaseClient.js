import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallback values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client only if credentials are provided
export const supabase =
  SUPABASE_URL &&
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
