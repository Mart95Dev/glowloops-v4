// Store de gestion du panier avec Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface pour un produit dans le panier
export interface CartItem {
  id: string;
  nom: string;
  prix: number;
  image: string;
  quantite: number;
  options?: Record<string, string>;
}

// Interface pour le state du panier
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantite'> & { quantite?: number }) => void;
  updateQuantity: (id: string, quantite: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

// Création du store avec persistance
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Ajouter un produit au panier
      addItem: (item) => set((state) => {
        const quantite = item.quantite || 1;
        const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
        
        let newItems: CartItem[];
        
        if (existingItemIndex !== -1) {
          // Si le produit existe déjà, mettre à jour la quantité
          newItems = [...state.items];
          newItems[existingItemIndex].quantite += quantite;
        } else {
          // Sinon, ajouter le nouveau produit
          newItems = [...state.items, { ...item, quantite }];
        }
        
        // Calculer les totaux
        const totalItems = newItems.reduce((sum, item) => sum + item.quantite, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
        
        return { items: newItems, totalItems, totalPrice };
      }),

      // Mettre à jour la quantité d'un produit
      updateQuantity: (id, quantite) => set((state) => {
        if (quantite <= 0) {
          // Si la quantité est 0 ou négative, supprimer l'article
          const newItems = state.items.filter((item) => item.id !== id);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantite, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
          return { items: newItems, totalItems, totalPrice };
        }
        
        const newItems = state.items.map((item) => 
          item.id === id ? { ...item, quantite } : item
        );
        
        // Calculer les totaux
        const totalItems = newItems.reduce((sum, item) => sum + item.quantite, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
        
        return { items: newItems, totalItems, totalPrice };
      }),

      // Supprimer un produit du panier
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter((item) => item.id !== id);
        
        // Calculer les totaux
        const totalItems = newItems.reduce((sum, item) => sum + item.quantite, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
        
        return { items: newItems, totalItems, totalPrice };
      }),

      // Vider le panier
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'glowloops-cart', // Nom pour le stockage local
    }
  )
);
