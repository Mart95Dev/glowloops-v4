'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

/**
 * Hook pour synchroniser les favoris avec Firebase au chargement de l'application
 * ou lorsque l'état d'authentification change
 */
export function useSyncFavorites() {
  const { user } = useAuth();
  const { syncWithFirebase, refreshCount } = useFavoritesStore();
  
  useEffect(() => {
    // Synchroniser au montage et quand l'utilisateur change
    const handleFavoritesSync = async () => {
      if (user) {
        await syncWithFirebase();
      }
      
      // Refresh le compteur dans tous les cas
      await refreshCount();
    };
    
    handleFavoritesSync();
    
    // Écouter les événements personnalisés pour les favoris
    const handleFavoritesUpdated = () => {
      handleFavoritesSync();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [user, syncWithFirebase, refreshCount]);
  
  // Ce hook ne retourne rien, il est utilisé uniquement pour les effets de bord
  return null;
}

/**
 * Hook pour synchroniser spécifiquement le compteur de la navbar
 * Utilisé uniquement dans le composant Navbar
 */
export function useSyncNavbarFavorites() {
  const { count, refreshCount } = useFavoritesStore();
  const [localCount, setLocalCount] = useState(count);
  
  // Mettre à jour le compteur local lorsque le store change
  useEffect(() => {
    setLocalCount(count);
  }, [count]);
  
  useEffect(() => {
    // Rafraîchir le compteur au montage du composant
    refreshCount();
    
    // Écouter les événements personnalisés pour les favoris
    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      
      // Si l'événement contient un compteur, mettre à jour directement
      if (customEvent.detail && customEvent.detail.count !== undefined) {
        setLocalCount(customEvent.detail.count);
      } else {
        // Sinon, rafraîchir le compteur depuis le store
        refreshCount().then(() => {
          // Utiliser le compteur du store après la mise à jour
          setLocalCount(useFavoritesStore.getState().count);
        });
      }
    };
    
    // Ajouter des écouteurs pour tous les événements liés aux favoris
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    window.addEventListener('favoritesCountUpdated', handleFavoritesUpdated);
    
    // Nettoyer les écouteurs lors du démontage du composant
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      window.removeEventListener('favoritesCountUpdated', handleFavoritesUpdated);
    };
  }, [refreshCount]);
  
  return { count: localCount };
} 