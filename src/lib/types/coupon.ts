import { z } from 'zod';

// Schéma Zod pour les bons de réduction
export const couponSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number(),
  minPurchase: z.number().optional(),
  expiryDate: z.date(),
  isUsed: z.boolean().default(false),
  usedAt: z.date().optional(),
  isActive: z.boolean().default(true),
  conditions: z.string().optional(),
  orderIdUsed: z.string().optional(),
});

// Type dérivé du schéma
export type Coupon = z.infer<typeof couponSchema>;

// Type pour l'historique des bons utilisés
export type UsedCoupon = Coupon & {
  usedAt: Date;
  orderIdUsed: string;
};

// Type pour le store de bons de réduction
export type CouponStore = {
  coupons: Coupon[];
  usedCoupons: UsedCoupon[];
  isLoading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  markCouponAsUsed: (couponId: string, orderId: string) => Promise<void>;
  verifyCoupon: (code: string) => Promise<Coupon | null>;
}; 