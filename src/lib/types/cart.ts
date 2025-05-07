import { z } from 'zod';

// Schéma pour les articles du panier
export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
  garantie: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number()
  }).nullable().optional(),
});

// Schéma pour les frais de livraison
export const ShippingFeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  estimatedDeliveryDays: z.number().optional(),
  description: z.string().optional(),
});

// Schéma pour la réduction
export const DiscountSchema = z.object({
  code: z.string(),
  amount: z.number(),
  type: z.enum(['percentage', 'fixed']),
  description: z.string().optional(),
});

// Schéma principal du panier
export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  subtotal: z.number(),
  shipping: ShippingFeeSchema.optional(),
  discount: DiscountSchema.optional(),
  total: z.number(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Types dérivés des schémas
export type CartItem = z.infer<typeof CartItemSchema>;
export type ShippingFee = z.infer<typeof ShippingFeeSchema>;
export type Discount = z.infer<typeof DiscountSchema>;
export type Cart = z.infer<typeof CartSchema>;

// Types pour les recommandations de produits dans le panier
export interface CrossSellProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

// Enum pour les types de livraison
export enum ShippingType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup',
}

// Options de livraison disponibles
export const SHIPPING_OPTIONS: ShippingFee[] = [
  {
    id: ShippingType.STANDARD,
    name: 'Livraison standard',
    price: 4.99,
    estimatedDeliveryDays: 5,
    description: 'Livraison en 3-5 jours ouvrés',
  },
  {
    id: ShippingType.EXPRESS,
    name: 'Livraison express',
    price: 9.99,
    estimatedDeliveryDays: 2,
    description: 'Livraison en 1-2 jours ouvrés',
  },
  {
    id: ShippingType.PICKUP,
    name: 'Retrait en point relais',
    price: 0,
    estimatedDeliveryDays: 5,
    description: 'Disponible en 3-5 jours ouvrés',
  },
]; 