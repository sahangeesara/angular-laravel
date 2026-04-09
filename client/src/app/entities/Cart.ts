export interface CartItem {
  id: number;
  item_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  item: any; // Should be Item, but backend may return null
}

export interface Cart {
  id: number;
  user_id: number;
  status: string;
  currency: string;
  item_count: number;
  total_amount: number;
  items: CartItem[];
}

