'use client';

import { useEffect } from 'react';
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
    
    // Vérifier régulièrement si les favoris ont changé
    const intervalId = setInterval(() => {
      refreshCount();
    }, 1000); // Vérifier toutes les secondes
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      clearInterval(intervalId);
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
  const { items, count, refreshCount } = useFavoritesStore();
  
  useEffect(() => {
    // Mettre à jour le compteur au changement des items
    refreshCount();
    
    // Écouter les événements personnalisés pour les favoris
    const handleFavoritesUpdated = (event: Event) => {
      // Rafraîchir le compteur immédiatement
      refreshCount();
      
      // Si l'événement contient des détails, on peut les utiliser pour optimiser
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.action) {
        console.log(`Action favoris: ${customEvent.detail.action} pour le produit: ${customEvent.detail.productId}`);
      }
    };
    
    // Écouter l'événement spécifique de mise à jour du compteur
    const handleCountUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.count !== undefined) {
        console.log(`Mise à jour du compteur de favoris: ${customEvent.detail.count}`);
        // On pourrait directement mettre à jour le compteur ici si nécessaire
        refreshCount();
      }
    };
    
    // Écouter plus de types d'événements pour être plus réactif
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    window.addEventListener('favoritesCountUpdated', handleCountUpdated);
    
    // Vérifier le compteur après un court délai pour s'assurer qu'il est à jour
    const timeoutId = setTimeout(() => {
      refreshCount();
    }, 300);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      window.removeEventListener('favoritesCountUpdated', handleCountUpdated);
      clearTimeout(timeoutId);
    };
  }, [items, refreshCount]);
  
  return { count };
} 