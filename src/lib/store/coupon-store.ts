import { create } from 'zustand';
import { CouponStore, UsedCoupon } from '../types/coupon';
import { getUserCoupons, getUserUsedCoupons, markCouponAsUsed, verifyCoupon } from '../firebase/coupon-service';
import { auth } from '../firebase/firebase-config';

export const useCouponStore = create<CouponStore>((set, get) => ({
  coupons: [],
  usedCoupons: [],
  isLoading: false,
  error: null,

  fetchCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      // Vérifier si l'utilisateur est connecté à partir de Firebase Auth
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        set({ isLoading: false, error: 'Utilisateur non connecté' });
        return;
      }

      const userId = currentUser.uid;
      
      // Récupérer les coupons actifs
      const activeCoupons = await getUserCoupons(userId);
      
      // Récupérer les coupons utilisés
      const usedCoupons = await getUserUsedCoupons(userId);
      
      set({ 
        coupons: activeCoupons, 
        usedCoupons: usedCoupons as UsedCoupon[], 
        isLoading: false,
        error: null // S'assurer qu'aucune erreur n'est définie
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des bons de réduction:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des bons de réduction' 
      });
    }
  },

  addCoupon: async (_newCoupon) => {
    // Cette fonctionnalité sera implémentée côté admin
    // On pourrait créer une fonction pour ajouter un coupon manuellement
    throw new Error('Non implémenté');
  },

  markCouponAsUsed: async (couponId, orderId) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        set({ isLoading: false, error: 'Utilisateur non connecté' });
        return;
      }

      const userId = currentUser.uid;
      
      await markCouponAsUsed(couponId, userId, orderId);
      
      // Mettre à jour l'état local
      const { coupons, usedCoupons } = get();
      const couponToMark = coupons.find(c => c.id === couponId);
      
      if (couponToMark) {
        const updatedCoupon = {
          ...couponToMark,
          isUsed: true,
          usedAt: new Date(),
          orderIdUsed: orderId
        };
        
        set({
          coupons: coupons.filter(c => c.id !== couponId),
          usedCoupons: [...usedCoupons, updatedCoupon as UsedCoupon],
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erreur lors du marquage du bon comme utilisé' 
      });
    }
  },

  verifyCoupon: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        set({ isLoading: false, error: 'Utilisateur non connecté' });
        return null;
      }

      const userId = currentUser.uid;
      
      const coupon = await verifyCoupon(code, userId);
      set({ isLoading: false });
      
      return coupon;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la vérification du bon' 
      });
      return null;
    }
  }
})); 