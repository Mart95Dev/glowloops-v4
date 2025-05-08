// Ce fichier existe pour maintenir la compatibilité et redirige vers cart-store.ts
// Il faut utiliser useCartStore de cart-store.ts pour toutes les nouvelles fonctionnalités

import { useCartStore, type CartItem } from './cart-store';

// Exporter le hook du store principal pour compatibilité descendante
export const useCart = useCartStore;

// Réexporter le type CartItem
export type { CartItem };
