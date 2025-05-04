import { create } from 'zustand';

type UIState = {
  // Navigation
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;
  
  // Actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  // État initial
  isMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  notifications: [],
  
  // Actions
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [
        ...state.notifications, 
        { 
          id: Math.random().toString(36).substring(2, 9), 
          ...notification 
        }
      ] 
    })),
  
  removeNotification: (id) => 
    set((state) => ({ 
      notifications: state.notifications.filter((n) => n.id !== id) 
    })),
  
  clearAllNotifications: () => set({ notifications: [] }),
}));
