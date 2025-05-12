// Store de gestion des favoris avec Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../firebase/firebase-config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

// Interface pour un produit favori
export interface FavoriteItem {
  id: string;
  nom: string;
  prix: number;
  image: string;
  dateAdded: number;
}

// Interface pour les paramètres de wishlist publique
export interface WishlistSettings {
  isPublic: boolean;
  title: string;
  slug: string;
  message?: string;
  theme: 'classic' | 'modern' | 'elegant' | 'festive' | 'minimal';
  updatedAt: number;
}

// Interface pour le state des favoris
interface FavoritesState {
  items: FavoriteItem[];
  count: number;
  wishlistSettings: WishlistSettings | null;
  
  // Actions
  addItem: (item: Omit<FavoriteItem, 'dateAdded'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  refreshCount: () => Promise<void>;
  syncWithFirebase: () => Promise<void>;

  // Wishlist publique
  setWishlistSettings: (settings: Partial<WishlistSettings>) => Promise<boolean>;
  getPublicWishlistUrl: () => string | null;
  generateSlug: (baseSlug: string) => Promise<string>;
  toggleWishlistPublic: (isPublic: boolean) => Promise<boolean>;
}

// Configuration par défaut de la wishlist
const defaultWishlistSettings: WishlistSettings = {
  isPublic: false,
  title: "Ma wishlist",
  slug: "",
  message: "",
  theme: 'classic',
  updatedAt: Date.now()
};

// Création du store avec persistance
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      wishlistSettings: null,

      // Ajouter un produit aux favoris
      addItem: async (item) => {
        const currentUser = auth.currentUser;
        const newItem: FavoriteItem = { ...item, dateAdded: Date.now() };
        
        // Mise à jour locale
        set((state) => {
          // Vérifier si l'article existe déjà
          if (state.items.some((i) => i.id === item.id)) {
            return state; // Ne rien faire si l'article existe déjà
          }
          
          const newItems = [...state.items, newItem];
          const newCount = newItems.length;
          
          // Notifier le changement via un événement personnalisé
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
              detail: { count: newCount, action: 'add', productId: item.id }
            }));
          }
          
          return { items: newItems, count: newCount };
        });
        
        // Synchronisation avec Firebase si l'utilisateur est connecté
        if (currentUser) {
          try {
            const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
            const docSnap = await getDoc(userFavoritesRef);
            
            if (docSnap.exists()) {
              // Mettre à jour le document existant
              await updateDoc(userFavoritesRef, {
                items: arrayUnion(newItem)
              });
            } else {
              // Créer un nouveau document
              await setDoc(userFavoritesRef, {
                items: [newItem]
              });
            }
          } catch (error) {
            console.error('Erreur lors de l\'ajout aux favoris:', error);
          }
        }
      },

      // Supprimer un produit des favoris
      removeItem: async (id) => {
        const currentUser = auth.currentUser;
        let removedItem: FavoriteItem | undefined;
        
        // Mise à jour locale
        set((state) => {
          removedItem = state.items.find((item) => item.id === id);
          const newItems = state.items.filter((item) => item.id !== id);
          const newCount = newItems.length;
          
          // Notifier le changement via un événement personnalisé
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
              detail: { count: newCount, action: 'remove', productId: id }
            }));
          }
          
          return { items: newItems, count: newCount };
        });
        
        // Synchronisation avec Firebase si l'utilisateur est connecté
        if (currentUser && removedItem) {
          try {
            const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
            
            await updateDoc(userFavoritesRef, {
              items: arrayRemove(removedItem)
            });
          } catch (error) {
            console.error('Erreur lors de la suppression des favoris:', error);
          }
        }
      },

      // Vider les favoris
      clearFavorites: async () => {
        const currentUser = auth.currentUser;
        
        // Mise à jour locale
        set({ items: [], count: 0 });
        
        // Notifier le changement via un événement personnalisé
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
            detail: { count: 0, action: 'clear' }
          }));
        }
        
        // Synchronisation avec Firebase si l'utilisateur est connecté
        if (currentUser) {
          try {
            const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
            
            await setDoc(userFavoritesRef, {
              items: []
            });
          } catch (error) {
            console.error('Erreur lors de la suppression des favoris:', error);
          }
        }
      },

      // Rafraîchir le compteur de favoris
      refreshCount: async () => {
        const currentItems = get().items;
        const newCount = currentItems.length;
        
        set({ count: newCount });
        
        // Notifier le changement via un événement personnalisé
        if (typeof window !== 'undefined' && get().count !== newCount) {
          window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
            detail: { count: newCount, action: 'refresh' }
          }));
        }
        
        return Promise.resolve();
      },

      // Synchroniser avec Firebase
      syncWithFirebase: async () => {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          try {
            // Synchroniser les favoris
            const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
            const docSnap = await getDoc(userFavoritesRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              const newItems = data.items || [];
              const newCount = newItems.length;
              
              set({ items: newItems, count: newCount });
              
              // Notifier le changement via un événement personnalisé
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
                  detail: { count: newCount, action: 'sync' }
                }));
              }
            }

            // Synchroniser les paramètres de wishlist
            const wishlistRef = doc(db, 'wishlists', currentUser.uid);
            const wishlistSnap = await getDoc(wishlistRef);
            
            if (wishlistSnap.exists()) {
              const data = wishlistSnap.data();
              set({ wishlistSettings: data as WishlistSettings });
            } else {
              // Initialiser avec les paramètres par défaut si n'existe pas encore
              set({ wishlistSettings: {
                ...defaultWishlistSettings,
                slug: `user-${currentUser.uid.substring(0, 8)}`
              }});
            }
          } catch (error) {
            console.error('Erreur lors de la synchronisation des favoris:', error);
          }
        }
      },

      // Mettre à jour les paramètres de la wishlist
      setWishlistSettings: async (settings) => {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          console.error('Utilisateur non connecté');
          return false;
        }
        
        try {
          const currentSettings = get().wishlistSettings || defaultWishlistSettings;
          const newSettings = { 
            ...currentSettings, 
            ...settings, 
            updatedAt: Date.now() 
          };
          
          // Mise à jour locale
          set({ wishlistSettings: newSettings });
          
          // Mise à jour dans Firestore
          const wishlistRef = doc(db, 'wishlists', currentUser.uid);
          await setDoc(wishlistRef, newSettings, { merge: true });
          
          return true;
        } catch (error) {
          console.error('Erreur lors de la mise à jour des paramètres de wishlist:', error);
          return false;
        }
      },

      // Récupérer l'URL de la wishlist publique
      getPublicWishlistUrl: () => {
        const settings = get().wishlistSettings;
        
        if (!settings || !settings.isPublic || !settings.slug) {
          return null;
        }
        
        // Construire l'URL en fonction de l'environnement
        const baseUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : 'https://glowloops.com';
          
        return `${baseUrl}/wishlist/${settings.slug}`;
      },

      // Générer un slug unique
      generateSlug: async (baseSlug) => {
        // Nettoyer le slug (pas d'espaces, pas de caractères spéciaux)
        let slug = baseSlug
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        // Vérifier si le slug existe déjà
        const slugQuery = query(collection(db, 'wishlists'), where('slug', '==', slug));
        const slugSnapshot = await getDocs(slugQuery);
        
        // Si le slug existe déjà, ajouter un suffixe numérique
        if (!slugSnapshot.empty) {
          const randomSuffix = Math.floor(Math.random() * 1000);
          slug = `${slug}-${randomSuffix}`;
        }
        
        return slug;
      },

      // Activer/désactiver la visibilité publique de la wishlist
      toggleWishlistPublic: async (isPublic) => {
        return get().setWishlistSettings({ isPublic });
      }
    }),
    {
      name: 'glowloops-favorites', // Nom pour le stockage local
    }
  )
);

// Hook pour accéder uniquement au compteur de favoris
export function useFavoritesCount() {
  const count = useFavoritesStore((state) => state.count);
  const refreshCount = useFavoritesStore((state) => state.refreshCount);
  
  return { count, refreshCount };
}

// Hook pour accéder aux fonctionnalités de wishlist publique
export function useWishlistPublic() {
  const wishlistSettings = useFavoritesStore((state) => state.wishlistSettings);
  const setWishlistSettings = useFavoritesStore((state) => state.setWishlistSettings);
  const getPublicWishlistUrl = useFavoritesStore((state) => state.getPublicWishlistUrl);
  const generateSlug = useFavoritesStore((state) => state.generateSlug);
  const toggleWishlistPublic = useFavoritesStore((state) => state.toggleWishlistPublic);
  
  return {
    wishlistSettings,
    setWishlistSettings,
    getPublicWishlistUrl,
    generateSlug,
    toggleWishlistPublic
  };
}
