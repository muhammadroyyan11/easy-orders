import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  popular: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderDetails {
  name: string;
  table: string;
  paymentMethod: string;
}

interface CartStore {
  items: CartItem[];
  orderDetails: OrderDetails | null;
  setOrderDetails: (details: OrderDetails) => void;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  orderDetails: null,
  setOrderDetails: (details) => set({ orderDetails: details }),
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },
  decreaseQuantity: (itemId) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === itemId);
      if (existingItem?.quantity === 1) {
        return { items: state.items.filter((i) => i.id !== itemId) };
      }
      return {
        items: state.items.map((i) =>
          i.id === itemId && i.quantity > 0 ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },
  removeItem: (itemId) => set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),
  clearCart: () => set({ items: [], orderDetails: null }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}));
