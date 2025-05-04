import { create } from 'zustand';
import { User } from 'firebase/auth';
import { persist } from 'zustand/middleware';

export type UserAddress = {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  complementAdresse?: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone: string;
  isDefault: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLoginAt: number;
  addresses: UserAddress[];
  favoris: string[];
};

type UserState = {
  // État
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      profile: null,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      addAddress: (address) => set((state) => {
        if (!state.profile) return state;
        
        const newAddress: UserAddress = {
          ...address,
          id: Math.random().toString(36).substring(2, 9),
          isDefault: state.profile.addresses.length === 0 ? true : address.isDefault || false
        };
        
        // Si la nouvelle adresse est définie comme par défaut, mettre à jour les autres
        let addresses = [...state.profile.addresses];
        if (newAddress.isDefault) {
          addresses = addresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
        }
        
        return {
          profile: {
            ...state.profile,
            addresses: [...addresses, newAddress]
          }
        };
      }),
      
      updateAddress: (id, updatedAddress) => set((state) => {
        if (!state.profile) return state;
        
        let addresses = [...state.profile.addresses];
        const index = addresses.findIndex(addr => addr.id === id);
        
        if (index === -1) return state;
        
        addresses[index] = {
          ...addresses[index],
          ...updatedAddress
        };
        
        // Si cette adresse devient celle par défaut, mettre à jour les autres
        if (updatedAddress.isDefault) {
          addresses = addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index
          }));
        }
        
        return {
          profile: {
            ...state.profile,
            addresses
          }
        };
      }),
      
      removeAddress: (id) => set((state) => {
        if (!state.profile) return state;
        
        const addresses = state.profile.addresses.filter(addr => addr.id !== id);
        
        // Si l'adresse supprimée était celle par défaut, définir la première comme par défaut
        if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
          addresses[0].isDefault = true;
        }
        
        return {
          profile: {
            ...state.profile,
            addresses
          }
        };
      }),
      
      setDefaultAddress: (id) => set((state) => {
        if (!state.profile) return state;
        
        const addresses = state.profile.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }));
        
        return {
          profile: {
            ...state.profile,
            addresses
          }
        };
      }),
      
      addToFavorites: (productId) => set((state) => {
        if (!state.profile) return state;
        
        // Vérifier si le produit est déjà dans les favoris
        if (state.profile.favoris.includes(productId)) return state;
        
        return {
          profile: {
            ...state.profile,
            favoris: [...state.profile.favoris, productId]
          }
        };
      }),
      
      removeFromFavorites: (productId) => set((state) => {
        if (!state.profile) return state;
        
        return {
          profile: {
            ...state.profile,
            favoris: state.profile.favoris.filter(id => id !== productId)
          }
        };
      }),
      
      clearUser: () => set({ user: null, profile: null, error: null })
    }),
    {
      name: 'glowloops-user-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
