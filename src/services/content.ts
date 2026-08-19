import { getSupabase } from '../lib/supabase/client';
import { Post, Page, PublicSetting } from '../types/database';
import { initialPosts, initialPages, initialSettings } from './mockData';

let localPosts = [...initialPosts];
let localPages = { ...initialPages };
let localSettings = [...initialSettings];

export const getPublishedPosts = async (): Promise<Post[]> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data) {
        return data as Post[];
      }
    } catch (err) {
      console.warn('Failed to load posts from Supabase:', err);
    }
  }

  return localPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch (err) {
      console.warn('Failed to load post by slug from Supabase:', err);
    }
  }

  const found = localPosts.find((p) => p.slug === slug && p.status === 'published');
  return found || null;
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Page;
      }
    } catch (err) {
      console.warn('Failed to load page from Supabase:', err);
    }
  }

  return localPages[slug] || null;
};

export const getPublicSettings = async (): Promise<Record<string, string>> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (!error && data) {
        const dict: Record<string, string> = {};
        (data as PublicSetting[]).forEach((s) => {
          dict[s.key] = s.value;
        });
        return dict;
      }
    } catch (err) {
      console.warn('Failed to load settings from Supabase:', err);
    }
  }

  const dict: Record<string, string> = {};
  localSettings.forEach((s) => {
    dict[s.key] = s.value;
  });
  return dict;
};

export const getLocalPosts = () => localPosts;
export const setLocalPosts = (posts: Post[]) => {
  localPosts = posts;
};
