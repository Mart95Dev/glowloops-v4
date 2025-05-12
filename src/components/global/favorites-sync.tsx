'use client';

import { useSyncFavorites } from '@/lib/hooks/use-sync-favorites';

/**
 * Composant client qui utilise le hook useSyncFavorites pour synchroniser
 * les favoris entre Firestore et le state local
 */
export default function FavoritesSync() {
  // Appel du hook pour synchroniser les favoris
  useSyncFavorites();
  
  // Ce composant ne rend rien, il est utilisé uniquement pour ses effets de bord
  return null;
} 