import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Category } from '../types/database';
import { initialCategories } from './mockData';

export async function getCategories(): Promise<Category[]> {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data as Category[]) || [];
    } catch (err) {
      console.error('getCategories error:', err);
      throw err;
    }
  }

  return initialCategories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
