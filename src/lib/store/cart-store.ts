import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  garantie?: {
    id: string;
    name: string;
    price: number;
  } | null;
};

type CartState = {
  // État
  items: CartItem[];
  isOpen: boolean;
  
  // Calculs
  totalItems: number;
  subtotal: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      isOpen: false,
      
      // Calculs
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      get subtotal() {
        return get().items.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const garantieTotal = item.garantie ? item.garantie.price * item.quantity : 0;
          return total + itemTotal + garantieTotal;
        }, 0);
      },
      
      // Actions
      addItem: (item) => set((state) => {
        // Vérifier si le produit est déjà dans le panier avec les mêmes options
        const existingItemIndex = state.items.findIndex(
          (i) => 
            i.productId === item.productId && 
            i.color === item.color &&
            ((!i.garantie && !item.garantie) || 
             (i.garantie?.id === item.garantie?.id))
        );
        
        // Si le produit existe déjà, augmenter la quantité
        if (existingItemIndex !== -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return { items: updatedItems };
        }
        
        // Sinon, ajouter un nouvel élément au panier
        return {
          items: [
            ...state.items,
            {
              ...item,
              id: Math.random().toString(36).substring(2, 9)
            }
          ]
        };
      }),
      
      updateItemQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item.id !== id)
          };
        }
        
        return {
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen }))
    }),
    {
      name: 'glowloops-cart-storage'
    }
  )
);
