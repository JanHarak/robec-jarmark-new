import { getSupabase } from '../lib/supabase/client';
import { Order, OrderStatus, Product, Inventory, Post } from '../types/database';
import { getLocalOrders, setLocalOrders } from './orders';
import { initialProducts, initialPosts } from './mockData';

let localInventoryList: (Inventory & { product_name: string; unit: string })[] = initialProducts.map((p) => ({
  product_id: p.id,
  product_name: p.name,
  unit: p.unit,
  quantity_on_hand: p.inventory?.quantity_on_hand || 0,
  quantity_reserved: p.inventory?.quantity_reserved || 0,
  quantity_preordered: p.inventory?.quantity_preordered || 0,
  updated_at: p.inventory?.updated_at || new Date().toISOString(),
}));

// Supabase Auth
export const loginAdmin = async (email: string, password: string) => {
  const supabase = getSupabase();
  if (!supabase) {
    // Local demo authentication for preview mode
    if (email === 'admin@lucnidvur.cz' && password === 'admin123') {
      const demoUser = { email, id: 'demo-admin-id', role: 'admin' };
      localStorage.setItem('DEMO_AUTH_USER', JSON.stringify(demoUser));
      return { user: demoUser, session: { access_token: 'demo-token' } };
    }
    // Also allow any valid credentials for easy preview testing
    const demoUser = { email, id: 'demo-admin-id', role: 'admin' };
    localStorage.setItem('DEMO_AUTH_USER', JSON.stringify(demoUser));
    return { user: demoUser, session: { access_token: 'demo-token' } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const logoutAdmin = async () => {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('DEMO_AUTH_USER');
};

export const getAdminSession = async () => {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session;
  }
  const demo = localStorage.getItem('DEMO_AUTH_USER');
  if (demo) {
    return { user: JSON.parse(demo) };
  }
  return null;
};

// Orders
export const getAdminOrders = async (statusFilter?: string): Promise<Order[]> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Failed to load admin orders from Supabase:', err);
    }
  }

  const orders = getLocalOrders();
  if (statusFilter && statusFilter !== 'all') {
    return orders.filter((o) => o.status === statusFilter);
  }
  return orders;
};

// RPC Actions for Order Status
export const confirmOrder = async (orderId: string, adminNotes?: string, expectedReadyDate?: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('confirm_order', {
        p_order_id: orderId,
        p_admin_notes: adminNotes || null,
        p_expected_ready_date: expectedReadyDate || null,
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC confirm_order failed:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'confirmed' as OrderStatus,
        admin_notes: adminNotes || o.admin_notes,
        expected_ready_date: expectedReadyDate || o.expected_ready_date,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
};

export const markOrderReady = async (orderId: string, pickupInfo?: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('mark_order_ready', {
        p_order_id: orderId,
        p_pickup_info: pickupInfo || null,
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC mark_order_ready failed:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'ready' as OrderStatus,
        pickup_info: pickupInfo || o.pickup_info || 'Připraveno ve výdejně',
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
};

export const completeOrder = async (orderId: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('complete_order', {
        p_order_id: orderId,
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC complete_order failed:', err);
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
};

export const rejectOrder = async (orderId: string, reason?: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('reject_order', {
        p_order_id: orderId,
        p_reason: reason || null,
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC reject_order failed:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'rejected' as OrderStatus,
        admin_notes: reason ? `Důvod: ${reason}` : o.admin_notes,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
};

export const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('cancel_order', {
        p_order_id: orderId,
        p_reason: reason || null,
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC cancel_order failed:', err);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: 'cancelled' as OrderStatus,
        admin_notes: reason ? `Zrušeno: ${reason}` : o.admin_notes,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  setLocalOrders(updated);
};

// Inventory & Stock
export const getInventoryList = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(name, unit)
        `);
      if (!error && data) {
        return data.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product?.name || 'Produkt',
          unit: item.product?.unit || 'ks',
          quantity_on_hand: item.quantity_on_hand,
          quantity_reserved: item.quantity_reserved,
          quantity_preordered: item.quantity_preordered,
          updated_at: item.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to load inventory from Supabase:', err);
    }
  }

  return localInventoryList;
};

export const addStock = async (productId: string, quantity: number, reason?: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.rpc('add_stock', {
        p_product_id: productId,
        p_quantity: quantity,
        p_reason: reason || 'Přírůstek ze dvora',
      });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('RPC add_stock failed:', err);
    }
  }

  const target = localInventoryList.find((i) => i.product_id === productId);
  if (target) {
    target.quantity_on_hand += quantity;
    target.updated_at = new Date().toISOString();
  }
};
