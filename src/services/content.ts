import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Post, Page, PublicSetting } from '../types/database';
import { initialPosts, initialPages, initialSettings } from './mockData';

let localPosts = [...initialPosts];
let localPages = { ...initialPages };
let localSettings = [...initialSettings];

export async function getPosts(): Promise<Post[]> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data as Post[];
  }

  return localPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
}

export async function getPublishedPosts(): Promise<Post[]> {
  return getPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data as Post;
  }

  const found = localPosts.find((p) => p.slug === slug && p.status === 'published');
  return found || null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Page;
  }

  return localPages[slug] || null;
}

export async function getAllPages(): Promise<Record<string, Page>> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data, error } = await supabase.from('pages').select('*');
    if (error) throw error;
    const dict: Record<string, Page> = {};
    (data as Page[]).forEach((p) => {
      dict[p.slug] = p;
    });
    return dict;
  }
  return localPages;
}

export async function updatePageContent(slug: string, title: string, content: string, heroImage?: string): Promise<void> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const updatePayload: any = { title, content, updated_at: new Date().toISOString() };
    if (heroImage !== undefined) updatePayload.hero_image = heroImage;
    const { error } = await supabase.from('pages').update(updatePayload).eq('slug', slug);
    if (error) throw error;
    return;
  }

  if (localPages[slug]) {
    localPages[slug] = {
      ...localPages[slug],
      title,
      content,
      hero_image: heroImage !== undefined ? heroImage : localPages[slug].hero_image,
      updated_at: new Date().toISOString(),
    };
  }
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data, error } = await supabase.from('settings').select('key,value');
    if (error) throw error;
    return Object.fromEntries(
      (data as PublicSetting[]).map((item) => [item.key, item.value])
    );
  }

  const dict: Record<string, string> = {};
  localSettings.forEach((s) => {
    dict[s.key] = s.value;
  });
  return dict;
}
