import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, OrderStatus, Inventory } from '../types/database';
import { getLocalOrders, setLocalOrders } from './orders';
import { initialProducts } from './mockData';

let localInventoryList: (Inventory & { product_name: string; unit: string })[] = initialProducts.map((p) => ({
  product_id: p.id,
  product_name: p.name,
  unit: p.unit,
  quantity_on_hand: p.inventory?.quantity_on_hand || 25,
  quantity_reserved: p.inventory?.quantity_reserved || 2,
  quantity_preordered: p.inventory?.quantity_preordered || 0,
  updated_at: p.inventory?.updated_at || new Date().toISOString(),
}));

export async function signIn(email: string, password: string) {
  const configured = isSupabaseConfigured();
  if (!configured) {
    const demoUser = { email, id: 'demo-admin-id', role: 'admin' };
    localStorage.setItem('DEMO_AUTH_USER', JSON.stringify(demoUser));
    return { user: demoUser, session: { access_token: 'demo-token' } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function loginAdmin(email: string, password: string) {
  return signIn(email, password);
}

export async function signOut() {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
  }
  localStorage.removeItem('DEMO_AUTH_USER');
}

export async function logoutAdmin() {
  return signOut();
}

export async function getSession() {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;
    } catch (e) {
      // ignore
    }
  }
  const demo = localStorage.getItem('DEMO_AUTH_USER');
  if (demo) {
    return { user: JSON.parse(demo) };
  }
  return null;
}

export async function getAdminSession() {
  return getSession();
}

export async function getOrders(statusFilter?: string): Promise<Order[]> {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase getOrders error:', error);
        throw error;
      }
      return (data || []).map((o: any) => ({
        ...o,
        items: o.items || o.order_items || []
      })) as Order[];
    } catch (err) {
      console.error('Failed to load admin orders from Supabase:', err);
      return [];
    }
  }

  const orders = getLocalOrders();
  if (statusFilter && statusFilter !== 'all') {
    return orders.filter((o) => o.status === statusFilter);
  }
  return orders;
}

export async function getAdminOrders(statusFilter?: string): Promise<Order[]> {
  return getOrders(statusFilter);
}

export async function confirmOrder(orderId: string, adminNote?: string, expectedReadyDate?: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('confirm_order', {
        p_order_id: orderId,
        p_expected_ready_date: expectedReadyDate ?? null,
        p_admin_note: adminNote ?? null,
      });
      if (!error) return data;
      console.error('Supabase confirm_order RPC error:', error);
    } catch (err) {
      console.error('RPC confirm_order exception:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'confirmed' as OrderStatus,
        admin_notes: adminNote || o.admin_notes,
        expected_ready_date: expectedReadyDate || o.expected_ready_date,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
}

export async function markOrderReady(orderId: string, pickupInfo?: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('mark_order_ready', {
        p_order_id: orderId,
        p_pickup_info: pickupInfo ?? null,
        p_pickup_date: null,
        p_pickup_time_from: null,
        p_pickup_time_to: null,
        p_pickup_location: null,
        p_pickup_note: null,
      });
      if (!error) return data;
      console.error('Supabase mark_order_ready RPC error:', error);
    } catch (err) {
      console.error('RPC mark_order_ready exception:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'ready' as OrderStatus,
        pickup_info: pickupInfo || 'Připraveno ve výdejně',
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
}

export async function completeOrder(orderId: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('complete_order', {
        p_order_id: orderId,
      });
      if (!error) return data;
      console.error('Supabase complete_order RPC error:', error);
    } catch (err) {
      console.error('RPC complete_order exception:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'completed' as OrderStatus,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
}

export async function rejectOrder(orderId: string, note?: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('reject_order', {
        p_order_id: orderId,
        p_admin_note: note ?? null,
      });
      if (!error) return data;
      console.error('Supabase reject_order RPC error:', error);
    } catch (err) {
      console.error('RPC reject_order exception:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'rejected' as OrderStatus,
        admin_notes: note ? `Důvod: ${note}` : o.admin_notes,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
}

export async function cancelOrder(orderId: string, note?: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('cancel_order', {
        p_order_id: orderId,
        p_admin_note: note ?? null,
      });
      if (!error) return data;
      console.error('Supabase cancel_order RPC error:', error);
    } catch (err) {
      console.error('RPC cancel_order exception:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'cancelled' as OrderStatus,
        admin_notes: note ? `Zrušeno: ${note}` : o.admin_notes,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
}

export async function getInventory() {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products (
            id,
            name,
            slug,
            unit
          )
        `);
      if (error) {
        console.error('Supabase getInventory error:', error);
        throw error;
      }
      return (data || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product?.name || 'Produkt',
        unit: item.product?.unit || 'ks',
        quantity_on_hand: item.quantity_on_hand,
        quantity_reserved: item.quantity_reserved,
        quantity_preordered: item.quantity_preordered,
        updated_at: item.updated_at,
      }));
    } catch (err) {
      console.error('Failed to load inventory from Supabase:', err);
      return [];
    }
  }

  return localInventoryList;
}

export async function getInventoryList() {
  return getInventory();
}

export async function addStock(productId: string, quantity: number, note?: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase.rpc('add_stock', {
        p_product_id: productId,
        p_quantity: quantity,
        p_note: note ?? null,
        p_movement_type: 'manual_adjustment',
      });
      if (!error) return data;
      console.error('Supabase add_stock RPC error:', error);
    } catch (err) {
      console.error('RPC add_stock exception:', err);
    }
  }

  const target = localInventoryList.find((i) => i.product_id === productId);
  if (target) {
    target.quantity_on_hand += quantity;
    target.updated_at = new Date().toISOString();
  } else {
    localInventoryList.push({
      product_id: productId,
      product_name: 'Produkt',
      unit: 'ks',
      quantity_on_hand: quantity,
      quantity_reserved: 0,
      quantity_preordered: 0,
      updated_at: new Date().toISOString(),
    });
  }
}

export async function createProduct(product: {
  name: string;
  slug: string;
  category_id: string | null;
  short_description?: string;
  description?: string;
  price: number;
  unit: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          category_id: product.category_id || null,
          short_description: product.short_description || '',
          description: product.description || '',
          price: product.price,
          unit: product.unit || 'ks',
          is_active: product.is_active ?? true,
          is_featured: product.is_featured ?? false,
          sort_order: product.sort_order ?? 0,
        })
        .select()
        .single();
      if (!error && data) {
        await supabase.from('inventory').upsert({
          product_id: data.id,
          quantity_on_hand: 20,
          quantity_reserved: 0,
          quantity_preordered: 0,
        });
        return data;
      }
      if (error) console.error('Supabase createProduct error:', error);
    } catch (err) {
      console.error('Supabase createProduct exception:', err);
    }
  }
  return { id: `prod-${Date.now()}`, ...product };
}

export async function updateProduct(productId: string, updates: any) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single();
      if (!error) return data;
      console.error('Supabase updateProduct error:', error);
    } catch (err) {
      console.error('Supabase updateProduct exception:', err);
    }
  }
  return { id: productId, ...updates };
}

export async function deleteProduct(productId: string) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);
      if (!error) return true;
      console.error('Supabase deleteProduct error:', error);
    } catch (err) {
      console.error('Supabase deleteProduct exception:', err);
    }
  }
  return true;
}

export async function addProductImage(productId: string, storagePath: string, altText?: string, isCover = false) {
  const configured = isSupabaseConfigured();
  if (configured) {
    try {
      if (isCover) {
        await supabase
          .from('product_images')
          .update({ is_cover: false })
          .eq('product_id', productId);
      }
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: storagePath,
          alt_text: altText || '',
          is_cover: isCover,
          sort_order: 0,
        })
        .select()
        .single();
      if (!error) return data;
      console.error('Supabase addProductImage error:', error);
    } catch (err) {
      console.error('Supabase addProductImage exception:', err);
    }
  }
  return null;
}

