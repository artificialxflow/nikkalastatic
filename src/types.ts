export interface Product {
  id: string;
  name: string;
  price: number; // in Tomans
  category: string; // e.g., 'digital', 'fashion', 'food', 'beauty'
  image: string; // high-quality online unsplash image
  discount: number; // percentage, e.g. 15 for 15% discount
  rating: number; // e.g. 4.6
  stock: number;
  salesCount: number;
  description: string;
}

export type OrderStatus = 'paid' | 'pending' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string; // Persian or formatted date
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}
