import { getSupabase } from '../lib/supabase/client';
import { Category, Product, ProductAvailability } from '../types/database';
import { initialCategories, initialProducts, computeMockAvailability } from './mockData';

// Local cache/store for reactive preview mode
let localProducts = [...initialProducts];
let localCategories = [...initialCategories];

export const getCategories = async (): Promise<Category[]> => {
  const supabase = getSupabase();
  if (!supabase) {
    return localCategories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data as Category[]) || [];
  } catch (err) {
    console.warn('Supabase query failed, falling back to local categories:', err);
    return localCategories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }
};

export const getProductAvailability = async (productId: string, fallbackProduct?: Product): Promise<ProductAvailability> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_product_availability', {
        p_product_id: productId,
      });

      if (!error && data) {
        return data as ProductAvailability;
      }
    } catch (err) {
      console.warn('RPC get_product_availability failed, falling back to calculation:', err);
    }
  }

  const prod = fallbackProduct || localProducts.find((p) => p.id === productId);
  if (!prod) {
    return {
      status: 'unavailable',
      available_quantity: 0,
      unit: 'ks',
      allow_preorder: false,
    };
  }

  return computeMockAvailability(prod);
};

export const getProducts = async (categoryId?: string, statusFilter?: string): Promise<Product[]> => {
  const supabase = getSupabase();

  let productsList: Product[] = [];

  if (supabase) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (!error && data) {
        productsList = data as Product[];
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local products:', err);
    }
  }

  if (productsList.length === 0) {
    productsList = localProducts.filter((p) => p.is_active);
    if (categoryId) {
      productsList = productsList.filter((p) => p.category_id === categoryId);
    }
  }

  // Attach category and availability
  const hydrated = await Promise.all(
    productsList.map(async (prod) => {
      const cat = prod.category || localCategories.find((c) => c.id === prod.category_id);
      const avail = await getProductAvailability(prod.id, prod);
      return {
        ...prod,
        category: cat,
        availability: avail,
      };
    })
  );

  if (statusFilter && statusFilter !== 'all') {
    return hydrated.filter((p) => p.availability?.status === statusFilter);
  }

  return hydrated;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const all = await getProducts();
  return all.filter((p) => p.is_featured);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        const prod = data as Product;
        const avail = await getProductAvailability(prod.id, prod);
        return {
          ...prod,
          availability: avail,
        };
      }
    } catch (err) {
      console.warn('Failed to load product by slug from Supabase:', err);
    }
  }

  const prod = localProducts.find((p) => p.slug === slug && p.is_active);
  if (!prod) return null;

  const cat = localCategories.find((c) => c.id === prod.category_id);
  const avail = await getProductAvailability(prod.id, prod);

  return {
    ...prod,
    category: cat,
    availability: avail,
  };
};

export const updateLocalProductInventory = (productId: string, onHandDelta: number, reservedDelta: number) => {
  const target = localProducts.find((p) => p.id === productId);
  if (target && target.inventory) {
    target.inventory.quantity_on_hand = Math.max(0, target.inventory.quantity_on_hand + onHandDelta);
    target.inventory.quantity_reserved = Math.max(0, target.inventory.quantity_reserved + reservedDelta);
  }
};
