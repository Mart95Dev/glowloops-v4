import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, ShippingFee, Discount } from '@/lib/types/cart';
import { syncCartWithFirestore, getUserCartFromFirestore } from '@/lib/services/cart-service';
import { auth } from '@/lib/firebase/auth';

// Définir un type temporaire pour Order puisque le module manque
type Order = {
  id: string;
  // Ajoutez d'autres propriétés si nécessaires, basées sur l'utilisation
  // C'est juste un type minimal pour éviter l'erreur any
};

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

// Définir un initializer pour s'assurer que le store possède toujours les bonnes valeurs de totalItems au démarrage
const initializeStore = (initialState: {
  items: CartItem[];
  shipping: ShippingFee | null;
  discount: Discount | null;
  totalItems?: number;
  subtotal?: number;
  total?: number;
} | null) => {
  console.log('[Cart Store] Initialisation du store');
  
  // Recalculer le nombre total d'articles
  if (initialState && initialState.items) {
    const items = initialState.items || [];
    const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    
    console.log('[Cart Store] Items initiaux:', items.length);
    console.log('[Cart Store] Total initial calculé:', totalItems);
    
    return {
      ...initialState,
      totalItems
    };
  }
  
  return initialState;
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
  totalPrice: number;
  lastOrder: Order | null;
  
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
  recalculateTotals: () => { totalItems: number; totalPrice: number };
  setLastOrder: (order: Order) => void;
  
  // Méthodes utilitaires internes
  _updateCalculatedValues: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      shipping: null,
      discount: null,
      totalItems: 0,
      subtotal: 0,
      total: 0,
      totalPrice: 0,
      lastOrder: null,
      
      // Méthode privée pour mettre à jour les valeurs calculées
      _updateCalculatedValues: () => {
        const state = get();
        
        // Calculer le nombre total d'articles
        const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        console.log('Calculé totalItems:', totalItems);
        
        // Calculer le sous-total
        const subtotal = state.items.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const garantieTotal = item.garantie ? item.garantie.price * item.quantity : 0;
          return total + itemTotal + garantieTotal;
        }, 0);
        
        // Calculer le total avec livraison et réduction
        let total = subtotal;
        
        if (state.shipping) {
          total += state.shipping.price;
        }
        
        if (state.discount) {
          if (state.discount.type === 'percentage') {
            total = total * (1 - state.discount.amount / 100);
          } else {
            total = Math.max(0, total - state.discount.amount);
          }
        }
        
        set({ totalItems, subtotal, total });
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
        console.log('Ajout au panier:', item);
        
        // Vérifier si le produit est déjà dans le panier avec les mêmes options
        const existingItemIndex = state.items.findIndex(
          (i) => 
            i.productId === item.productId && 
            i.color === item.color &&
            ((!i.garantie && !item.garantie) || 
             (i.garantie?.id === item.garantie?.id))
        );
        
        let newItems;
        
        // Si le produit existe déjà, augmenter la quantité
        if (existingItemIndex !== -1) {
          newItems = [...state.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          // Sinon, ajouter un nouvel élément au panier
          newItems = [
            ...state.items,
            {
              ...item,
              id: Math.random().toString(36).substring(2, 9)
            }
          ];
        }
        
        console.log('Nouveau panier:', newItems);
        console.log('Nombre d\'articles calculé:', newItems.reduce((total, item) => total + item.quantity, 0));
        
        // Mettre à jour les items
        const newState = { items: newItems };
        
        // Calculer les nouvelles valeurs après la mise à jour de l'état
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
      updateItemQuantity: (id, quantity) => set((state) => {
        let newItems;
        
        if (quantity <= 0) {
          newItems = state.items.filter((item) => item.id !== id);
        } else {
          newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
        }
        
        // Mettre à jour les items
        const newState = { items: newItems };
        
        // Calculer les nouvelles valeurs après la mise à jour de l'état
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter((item) => item.id !== id);
        
        // Mettre à jour les items
        const newState = { items: newItems };
        
        // Calculer les nouvelles valeurs après la mise à jour de l'état
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
      clearCart: () => set(() => {
        const newState = { items: [], shipping: null, discount: null };
        
        // Calculer les nouvelles valeurs après la mise à jour de l'état
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
      setShipping: (shipping) => set(() => {
        const newState = { shipping };
        
        // Recalculer le total après la mise à jour
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
      setDiscount: (discount) => set(() => {
        const newState = { discount };
        
        // Recalculer le total après la mise à jour
        setTimeout(() => get()._updateCalculatedValues(), 0);
        
        return newState;
      }),
      
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
          
          // Recalculer les valeurs
          get()._updateCalculatedValues();
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
            
            // Recalculer les valeurs
            get()._updateCalculatedValues();
            
            console.log('Panier chargé depuis Firestore');
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
        }
      },
      
      // Recalculer les totaux
      recalculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = state.items.reduce((total, item) => {
          const itemPrice = item.price * item.quantity;
          const garantiePrice = item.garantie ? item.garantie.price * item.quantity : 0;
          return total + itemPrice + garantiePrice;
        }, 0);
        
        console.log('Recalcul des totaux - items:', state.items.length, 'totalItems:', totalItems, 'totalPrice:', totalPrice);
        
        // Mettre à jour le store pour être sûr que les totaux sont corrects
        set({ totalItems, totalPrice });
        
        return { totalItems, totalPrice };
      },
      
      // Définir la dernière commande
      setLastOrder: (order) => set(() => ({
        lastOrder: order
      }))
    }),
    {
      name: 'glowloops-cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Panier restauré depuis le stockage local');
          // Utiliser initializeStore pour corriger les valeurs calculées
          const initializedState = initializeStore(state);
          if (initializedState) {
            // Mettre à jour l'état avec les valeurs calculées
            state.totalItems = initializedState.totalItems || 0;
            // Mettre à jour les valeurs calculées après restauration
            state._updateCalculatedValues();
          }
        }
      }
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

// Fonctions utilitaires
export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.price * item.quantity;
    const garantiePrice = item.garantie ? item.garantie.price * item.quantity : 0;
    return total + itemPrice + garantiePrice;
  }, 0);
};
