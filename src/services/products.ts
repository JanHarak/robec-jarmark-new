import { supabase, isSupabaseConfigured, getPublicImageUrl } from '../lib/supabase';
import { Category, Product, ProductAvailability } from '../types/database';
import { initialCategories, initialProducts, computeMockAvailability } from './mockData';
import { getCategories } from './categories';

export async function getProducts(categoryId?: string, statusFilter?: string): Promise<Product[]> {
  const configured = isSupabaseConfigured();
  let productsList: Product[] = [];

  if (configured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          ),
          product_images (
            id,
            storage_path,
            alt_text,
            sort_order,
            is_cover
          ),
          inventory:inventory(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        productsList = data as Product[];
      }
    } catch (err) {
      console.error('getProducts error:', err);
      throw err;
    }
  } else {
    productsList = initialProducts.filter((p) => p.is_active);
  }

  let hydrated = await Promise.all(
    productsList.map(async (prod) => {
      const cat = prod.category || initialCategories.find((c) => c.id === prod.category_id);
      const avail = await getProductAvailability(prod.id, prod);
      
      const images = (prod.product_images || prod.images || []).map((img: any) => ({
        ...img,
        url: img.storage_path ? getPublicImageUrl(img.storage_path) : (img.url || '')
      }));

      return {
        ...prod,
        category: cat,
        images,
        availability: avail,
      };
    })
  );

  if (categoryId && categoryId !== 'all') {
    hydrated = hydrated.filter((p) =>
      p.category_id === categoryId ||
      p.category?.id === categoryId ||
      p.category?.slug === categoryId
    );
  }

  if (statusFilter && statusFilter !== 'all') {
    hydrated = hydrated.filter((p) => p.availability?.status === statusFilter);
  }

  return hydrated;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const configured = isSupabaseConfigured();

  if (configured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          ),
          product_images (
            id,
            storage_path,
            alt_text,
            sort_order,
            is_cover
          ),
          inventory:inventory(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (data) {
        const prod = data as Product;
        const avail = await getProductAvailability(prod.id, prod);
        const images = (prod.product_images || prod.images || []).map((img: any) => ({
          ...img,
          url: img.storage_path ? getPublicImageUrl(img.storage_path) : (img.url || '')
        }));
        return {
          ...prod,
          images,
          availability: avail,
        };
      }
    } catch (err) {
      console.warn('getProductBySlug error:', err);
    }
  }

  const prod = initialProducts.find((p) => p.slug === slug && p.is_active);
  if (!prod) return null;

  const cat = initialCategories.find((c) => c.id === prod.category_id);
  const avail = await getProductAvailability(prod.id, prod);

  return {
    ...prod,
    category: cat,
    availability: avail,
  };
}

export async function getProductAvailability(productId: string, fallbackProduct?: Product): Promise<ProductAvailability> {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('get_product_availability', {
        p_product_id: productId,
      });

      if (!error && data) {
        return data as ProductAvailability;
      }
    } catch (err) {
      console.warn('RPC get_product_availability failed:', err);
    }
  }

  const prod = fallbackProduct || initialProducts.find((p) => p.id === productId);
  if (!prod) {
    return {
      product_id: productId,
      status: 'unavailable',
      available_quantity: 0,
      unit: 'ks',
      allow_preorder: false,
      preorder_remaining: null,
      expected_available_at: null,
      available_from: null,
      available_until: null,
      season_start_month: null,
      season_end_month: null,
      lead_time_days_min: null,
      lead_time_days_max: null,
    };
  }

  return computeMockAvailability(prod);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.is_featured);
}

export { getCategories };
