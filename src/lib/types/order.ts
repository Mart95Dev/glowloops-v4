import { z } from 'zod';

// Schéma pour les articles individuels dans une commande
export const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  variant: z.string().optional(),
  subtotal: z.number().positive(),
});

// Schéma pour l'adresse de livraison
export const ShippingAddressSchema = z.object({
  fullName: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phoneNumber: z.string().optional(),
});

// Schéma pour le statut de la commande
export const OrderStatusEnum = z.enum([
  'pending', // En attente de paiement
  'processing', // Paiement confirmé, en cours de traitement
  'shipped', // Expédiée
  'delivered', // Livrée
  'cancelled', // Annulée
  'refunded', // Remboursée
]);

// Schéma pour la méthode de paiement
export const PaymentMethodSchema = z.object({
  type: z.enum(['card', 'paypal', 'bank_transfer', 'other']),
  details: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  transactionId: z.string().optional(),
});

// Schéma principal pour une commande
export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userEmail: z.string().email(),
  items: z.array(OrderItemSchema),
  shippingAddress: ShippingAddressSchema,
  billingAddress: ShippingAddressSchema.optional(),
  orderDate: z.date(),
  status: OrderStatusEnum,
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0).optional(),
  total: z.number().positive(),
  paymentMethod: PaymentMethodSchema,
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
  lastUpdated: z.date().optional(),
});

// Types dérivés des schémas Zod
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type Order = z.infer<typeof OrderSchema>; 