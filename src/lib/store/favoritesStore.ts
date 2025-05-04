// Store de gestion des favoris avec Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../firebase/firebase-config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

// Interface pour un produit favori
export interface FavoriteItem {
  id: string;
  nom: string;
  prix: number;
  image: string;
  dateAdded: number;
}

// Interface pour le state des favoris
interface FavoritesState {
  items: FavoriteItem[];
  count: number;
  
  // Actions
  addItem: (item: Omit<FavoriteItem, 'dateAdded'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  refreshCount: () => Promise<void>;
  syncWithFirebase: () => Promise<void>;
}

// Création du store avec persistance
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      count: 0,

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
          return { items: newItems, count: newItems.length };
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
          return { items: newItems, count: newItems.length };
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
        set((state) => ({ count: state.items.length }));
      },

      // Synchroniser avec Firebase
      syncWithFirebase: async () => {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          try {
            const userFavoritesRef = doc(db, 'userFavorites', currentUser.uid);
            const docSnap = await getDoc(userFavoritesRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              set({ items: data.items || [], count: (data.items || []).length });
            }
          } catch (error) {
            console.error('Erreur lors de la synchronisation des favoris:', error);
          }
        }
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
