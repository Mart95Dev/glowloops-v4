import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, ShippingFee, Discount } from '@/lib/types/cart';
import { syncCartWithFirestore, getUserCartFromFirestore } from '@/lib/services/cart-service';
import { auth } from '@/lib/firebase/auth';

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
  shipping: ShippingFee | null;
  discount: Discount | null;
  
  // Calculs
  totalItems: number;
  subtotal: number;
  total: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setShipping: (shipping: ShippingFee | null) => void;
  setDiscount: (discount: Discount | null) => void;
  syncWithFirestore: () => Promise<void>;
  loadFromFirestore: () => Promise<void>;
  toCart: () => Cart;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      shipping: null,
      discount: null,
      
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

      get total() {
        const { subtotal, shipping, discount } = get();
        let total = subtotal;
        
        // Ajouter les frais de livraison si présents
        if (shipping) {
          total += shipping.price;
        }
        
        // Appliquer la réduction si présente
        if (discount) {
          if (discount.type === 'percentage') {
            total = total * (1 - discount.amount / 100);
          } else {
            total = Math.max(0, total - discount.amount);
          }
        }
        
        return total;
      },
      
      // Conversion vers l'objet Cart
      toCart: () => {
        const { items, subtotal, shipping, discount, total } = get();
        return {
          items,
          subtotal,
          shipping: shipping || undefined,
          discount: discount || undefined,
          total,
          updatedAt: new Date().toISOString()
        };
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
      
      clearCart: () => set({ items: [], shipping: null, discount: null }),
      
      setShipping: (shipping) => set({ shipping }),
      
      setDiscount: (discount) => set({ discount }),
      
      // Synchronisation avec Firestore
      syncWithFirestore: async () => {
        const cart = get().toCart();
        const updatedCart = await syncCartWithFirestore(cart);
        
        // Mettre à jour l'état local si nécessaire
        if (updatedCart !== cart) {
          set({
            items: updatedCart.items,
            shipping: updatedCart.shipping || null,
            discount: updatedCart.discount || null
          });
        }
      },
      
      // Charger le panier depuis Firestore
      loadFromFirestore: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        try {
          const userId = currentUser.uid;
          const remoteCart = await getUserCartFromFirestore(userId);
          
          if (remoteCart) {
            set({
              items: remoteCart.items || [],
              shipping: remoteCart.shipping || null,
              discount: remoteCart.discount || null
            });
            console.log('Panier chargé depuis Firestore');
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
        }
      }
    }),
    {
      name: 'glowloops-cart-storage'
    }
  )
);

// Hook d'écoute d'authentification pour synchroniser le panier
export const setupCartAuthListener = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Utilisateur connecté, charger son panier depuis Firestore
      useCartStore.getState().loadFromFirestore();
    } else {
      // Utilisateur déconnecté, on ne fait rien (le panier local reste inchangé)
      console.log('Utilisateur déconnecté, utilisation du panier local');
    }
  });
};
