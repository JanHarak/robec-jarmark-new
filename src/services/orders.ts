import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, OrderStatus } from '../types/database';

let localOrders: Order[] = [];

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNote?: string;
  p_customer_name?: string;
  p_customer_email?: string;
  p_customer_phone?: string;
  p_customer_note?: string;
  items?: CreateOrderItem[];
  p_items?: CreateOrderItem[];
}

export async function createOrder(input: CreateOrderInput) {
  const configured = isSupabaseConfigured();

  const cName = input.customerName || input.p_customer_name || '';
  const cEmail = input.customerEmail || input.p_customer_email || '';
  const cPhone = input.customerPhone || input.p_customer_phone;
  const cNote = input.customerNote || input.p_customer_note;
  const cItems = input.items || input.p_items || [];

  if (configured) {
    const { data, error } = await supabase.rpc('create_order', {
      p_customer_name: cName,
      p_customer_email: cEmail,
      p_customer_phone: cPhone ?? null,
      p_customer_note: cNote ?? null,
      p_items: cItems,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // Local fallback for preview
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: `R-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    type: 'reservation',
    status: 'pending',
    customer_name: cName,
    customer_email: cEmail,
    customer_phone: cPhone || null,
    customer_note: cNote || null,
    total_price: 250,
    expected_ready_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickup_info: 'Výdej ze dvora Robeč',
    admin_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: cItems.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      order_id: `ord-${Date.now()}`,
      product_id: it.product_id,
      product_name: 'Položka rezervace',
      quantity: it.quantity,
      unit_price: 85,
      total_price: it.quantity * 85,
      item_type: 'reservation',
      unit: 'ks',
    })),
  };

  localOrders.unshift(newOrder);
  return newOrder;
}

export const getLocalOrders = () => localOrders;
export const setLocalOrders = (orders: Order[]) => {
  localOrders = orders;
};
