import { create } from 'zustand';
import { Product, ProductDisplay } from '../types/product';
import { getAllProducts, getNewArrivals, getPopularProducts, convertToProductDisplay } from '../services/product-service';

interface ProductState {
  products: ProductDisplay[];
  newArrivals: ProductDisplay[];
  popularProducts: ProductDisplay[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllProducts: () => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  fetchPopularProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  newArrivals: [],
  popularProducts: [],
  isLoading: false,
  error: null,
  
  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await getAllProducts();
      // Convertir les produits en format d'affichage
      const displayProducts = products.map(product => convertToProductDisplay(product));
      set({ products: displayProducts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des produits', 
        isLoading: false 
      });
    }
  },
  
  fetchNewArrivals: async () => {
    set({ isLoading: true, error: null });
    try {
      const newArrivals = await getNewArrivals();
      // Convertir les produits en format d'affichage
      const displayProducts = newArrivals.map(product => convertToProductDisplay(product));
      set({ newArrivals: displayProducts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des nouveaux produits', 
        isLoading: false 
      });
    }
  },
  
  fetchPopularProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const popularProducts = await getPopularProducts();
      // Convertir les produits en format d'affichage
      const displayProducts = popularProducts.map(product => convertToProductDisplay(product));
      set({ popularProducts: displayProducts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des produits populaires', 
        isLoading: false 
      });
    }
  },
}));
