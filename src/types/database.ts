export type ProductStatus =
  | 'available'
  | 'preorder'
  | 'made_to_order'
  | 'coming_soon'
  | 'sold_out'
  | 'out_of_season'
  | 'unavailable'
  | 'hidden';

export type OrderType = 'reservation' | 'preorder' | 'mixed';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'waiting'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Inventory {
  product_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_preordered: number;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  unit: string;
  is_active: boolean;
  is_featured: boolean;
  is_seasonal: boolean;
  season_start_month?: number | null; // 1-12
  season_end_month?: number | null; // 1-12
  season_notes?: string | null;
  allow_preorder: boolean;
  preorder_limit?: number | null;
  preorder_deadline?: string | null;
  expected_available_at?: string | null;
  is_made_to_order: boolean;
  lead_time_days_min?: number | null;
  lead_time_days_max?: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined or derived fields:
  category?: Category;
  images?: ProductImage[];
  product_images?: ProductImage[];
  inventory?: Inventory;
  availability?: ProductAvailability;
}

export interface ProductAvailability {
  product_id?: string;
  status: ProductStatus;
  available_quantity: number;
  unit: string;
  allow_preorder: boolean;
  preorder_remaining?: number | null;
  expected_available_at?: string | null;
  available_from?: string | null;
  available_until?: string | null;
  season_start_month?: number | null;
  season_end_month?: number | null;
  lead_time_days_min?: number | null;
  lead_time_days_max?: number | null;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_type: 'reservation' | 'preorder' | 'made_to_order';
  product_name: string;
  unit: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_note?: string;
  total_price: number;
  expected_ready_date?: string | null;
  pickup_info?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CreateOrderParams {
  p_customer_name: string;
  p_customer_email: string;
  p_customer_phone?: string;
  p_customer_note?: string;
  p_items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface CreateOrderResult {
  order_id: string;
  order_number: string;
  status: OrderStatus;
  type: OrderType;
  total_price: number;
  message?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  perex?: string;
  content: string;
  cover_image?: string;
  status: PostStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  hero_image?: string;
  meta_description?: string;
  updated_at: string;
}

export interface PublicSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
