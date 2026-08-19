import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const override = window.localStorage.getItem(`CONFIG_${key}`);
    if (override) return override;
    const overrideAlt = window.localStorage.getItem(`CONFIG_SUPABASE_${key}`);
    if (overrideAlt) return overrideAlt;
  }
  
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    // @ts-ignore
    if (import.meta.env[key]) return import.meta.env[key];
  }
  return '';
};

const getSupabaseKey = (): string => {
  return (
    getEnvVar('SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('SUPABASE_ANON_KEY') ||
    ''
  );
};

export const isSupabaseConfigured = (): boolean => {
  const url = getEnvVar('SUPABASE_URL');
  const key = getSupabaseKey();
  return Boolean(url && key && !url.includes('<DOPLNIM') && !url.includes('your-project'));
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const url = getEnvVar('SUPABASE_URL');
  const key = getSupabaseKey();

  if (!url || !key || url.includes('<DOPLNIM') || url.includes('your-project')) {
    return null;
  }

  if (!supabaseInstance || supabaseInstance['supabaseUrl'] !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
};

// Export singleton supabase instance as required by the implementation manual
export const supabase = getSupabase() || createClient('https://placeholder.supabase.co', 'placeholder-key', {
  auth: { persistSession: false }
});

export function getPublicImageUrl(path: string): string {
  const sb = getSupabase();
  if (!sb || !path) return path || '';
  try {
    const { data } = sb.storage.from('farm-public').getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return path;
  }
}
