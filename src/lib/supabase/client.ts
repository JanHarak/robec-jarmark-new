import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both Vite (import.meta.env) and local configurations
const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const override = window.localStorage.getItem(`CONFIG_${key}`);
    if (override) return override;
  }
  
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    // @ts-ignore
    if (import.meta.env[`NEXT_PUBLIC_${key}`]) return import.meta.env[`NEXT_PUBLIC_${key}`];
    // @ts-ignore
    if (import.meta.env[key]) return import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

let supabaseInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = getEnvVar('SUPABASE_URL');
  const key = getEnvVar('SUPABASE_ANON_KEY');
  return Boolean(url && key && !url.includes('<DOPLNIM') && !url.includes('your-project'));
};

export const getSupabase = (): SupabaseClient | null => {
  const url = getEnvVar('SUPABASE_URL');
  const key = getEnvVar('SUPABASE_ANON_KEY');

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance || supabaseInstance['supabaseUrl'] !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
};

export const setSupabaseConfigOverride = (url: string, key: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (url) window.localStorage.setItem('CONFIG_SUPABASE_URL', url.trim());
    else window.localStorage.removeItem('CONFIG_SUPABASE_URL');

    if (key) window.localStorage.setItem('CONFIG_SUPABASE_ANON_KEY', key.trim());
    else window.localStorage.removeItem('CONFIG_SUPABASE_ANON_KEY');

    supabaseInstance = null;
  }
};

export const clearSupabaseConfigOverride = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('CONFIG_SUPABASE_URL');
    window.localStorage.removeItem('CONFIG_SUPABASE_ANON_KEY');
    supabaseInstance = null;
  }
};
