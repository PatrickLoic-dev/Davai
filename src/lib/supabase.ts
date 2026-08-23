import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        // Explicit (these are the defaults) — the session must survive the
        // app being closed and reopened, which is exactly how the PWA is
        // meant to behave: reopen the icon, land straight in the dashboard.
        persistSession: true,
        autoRefreshToken: true,
        ...(typeof window !== 'undefined' ? { storage: window.localStorage } : {}),
      },
    })
  : null;
