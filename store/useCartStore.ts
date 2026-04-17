import { create } from 'zustand';

export interface CartItem {
  id: string; // Unique cart item ID (productId + '-' + variantId if applicable)
  productId?: string; // The actual DB product ID
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedForCheckout?: boolean;
  variant?: {
    id: string;
    size: string;
    color: string;
  };
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (product: Omit<CartItem, 'quantity' | 'selectedForCheckout'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleItemSelection: (id: string) => void;
  toggleAllSelection: (selected: boolean) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalSelectedPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  addItem: (product) => {
    set((state) => {
      // Create a unique cart item ID based on variant if it exists
      const uniqueId = product.variant ? `${product.id}-${product.variant.id}` : product.id;
      const actualProductId = product.productId || product.id;
      
      const existingItem = state.items.find((item) => item.id === uniqueId);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === uniqueId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { 
        items: [...state.items, { ...product, id: uniqueId, productId: actualProductId, quantity: 1, selectedForCheckout: true }],
      };
    });
  },
  
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
    
  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }),
    
  toggleItemSelection: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, selectedForCheckout: !item.selectedForCheckout } : item
      ),
    })),
    
  toggleAllSelection: (selected) =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selectedForCheckout: selected })),
    })),
    
  clearCart: () => set({ items: [] }),
  
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getTotalSelectedPrice: () => {
    const { items } = get();
    return items
      .filter(item => item.selectedForCheckout)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
