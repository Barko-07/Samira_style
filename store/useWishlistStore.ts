import { create } from 'zustand';

interface WishlistStore {
  items: string[]; // List of product IDs
  toggleItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  toggleItem: (id) => {
    set((state) => {
      const isFav = state.items.includes(id);
      if (isFav) {
        return { items: state.items.filter((item) => item !== id) };
      } else {
        return { items: [...state.items, id] };
      }
    });
  },
  isFavorite: (id) => get().items.includes(id),
}));
