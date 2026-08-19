import { getSupabase } from '../lib/supabase/client';
import { CreateOrderParams, CreateOrderResult, Order, OrderType, OrderStatus } from '../types/database';
import { initialOrders, initialProducts } from './mockData';
import { updateLocalProductInventory } from './products';

let localOrders: Order[] = [...initialOrders];

export const createOrder = async (params: CreateOrderParams): Promise<CreateOrderResult> => {
  // 1. Validation
  if (!params.p_customer_name?.trim()) {
    throw new Error('Prosím zadejte vaše jméno a příjmení.');
  }
  if (!params.p_customer_email?.trim() || !params.p_customer_email.includes('@')) {
    throw new Error('Prosím zadejte platnou e-mailovou adresu.');
  }
  if (!params.p_items || params.p_items.length === 0) {
    throw new Error('Objednávka neobsahuje žádné položky.');
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('create_order', {
        p_customer_name: params.p_customer_name.trim(),
        p_customer_email: params.p_customer_email.trim(),
        p_customer_phone: params.p_customer_phone?.trim() || null,
        p_customer_note: params.p_customer_note?.trim() || null,
        p_items: params.p_items,
      });

      if (error) {
        throw new Error(error.message || 'Chyba při vytváření rezervace.');
      }

      if (data) {
        return data as CreateOrderResult;
      }
    } catch (err: any) {
      console.warn('RPC create_order call encountered error or Supabase not reachable:', err);
      // If RPC failed due to validation or logic from database, rethrow
      if (err.message && !err.message.includes('fetch') && !err.message.includes('network')) {
        throw err;
      }
    }
  }

  // Fallback local logic conforming exactly to RPC business rules
  let calculatedTotalPrice = 0;
  let hasReservation = false;
  let hasPreorder = false;
  let hasMadeToOrder = false;

  const orderItemsData = params.p_items.map((item, idx) => {
    const product = initialProducts.find((p) => p.id === item.product_id);
    if (!product) {
      throw new Error(`Produkt ${item.product_id} nebyl nalezen.`);
    }

    if (item.quantity <= 0) {
      throw new Error(`Neplatné množství pro položku ${product.name}.`);
    }

    let itemType: 'reservation' | 'preorder' | 'made_to_order' = 'reservation';
    if (product.is_made_to_order) {
      itemType = 'made_to_order';
      hasMadeToOrder = true;
    } else if (product.allow_preorder && (product.is_seasonal || (product.inventory?.quantity_on_hand || 0) <= 0)) {
      itemType = 'preorder';
      hasPreorder = true;
    } else {
      itemType = 'reservation';
      hasReservation = true;
      // Reserve inventory locally
      updateLocalProductInventory(product.id, 0, item.quantity);
    }

    const subtotal = product.price * item.quantity;
    calculatedTotalPrice += subtotal;

    return {
      id: `item-${Date.now()}-${idx}`,
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.price,
      total_price: subtotal,
      item_type: itemType,
      unit: product.unit,
    };
  });

  let determinedType: OrderType = 'reservation';
  const typeCount = (hasReservation ? 1 : 0) + (hasPreorder ? 1 : 0) + (hasMadeToOrder ? 1 : 0);
  if (typeCount > 1) {
    determinedType = 'mixed';
  } else if (hasPreorder) {
    determinedType = 'preorder';
  } else if (hasMadeToOrder) {
    determinedType = 'reservation';
  }

  const generatedOrderNumber = `R-2026-${String(localOrders.length + 43).padStart(5, '0')}`;
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: generatedOrderNumber,
    type: determinedType,
    status: 'pending',
    customer_name: params.p_customer_name.trim(),
    customer_email: params.p_customer_email.trim(),
    customer_phone: params.p_customer_phone?.trim(),
    customer_note: params.p_customer_note?.trim(),
    total_price: calculatedTotalPrice,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: orderItemsData,
  };

  localOrders.unshift(newOrder);

  return {
    order_id: newOrder.id,
    order_number: newOrder.order_number,
    status: newOrder.status,
    type: newOrder.type,
    total_price: newOrder.total_price,
    message: 'Rezervace byla úspěšně přijata a čeká na potvrzení hospodářem.',
  };
};

export const getLocalOrders = () => localOrders;
export const setLocalOrders = (orders: Order[]) => {
  localOrders = orders;
};
