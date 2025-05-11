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
export const AddressSchema = z.object({
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
  'returned', // Retournée
]);

// Schéma pour la méthode de paiement
export const PaymentMethodEnum = z.enum(['card', 'paypal', 'bank_transfer', 'other']);

// Schéma pour un événement de changement de statut
export const StatusChangeSchema = z.object({
  status: z.string(),
  timestamp: z.date(),
  note: z.string().optional(),
});

// Schéma principal pour une commande
export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orderNumber: z.string().optional(),
  items: z.array(OrderItemSchema),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  orderDate: z.date(),
  expectedDeliveryDate: z.date().nullable().optional(),
  status: OrderStatusEnum,
  statusHistory: z.array(StatusChangeSchema).optional(),
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0).optional(),
  total: z.number().positive(),
  paymentMethod: PaymentMethodEnum,
  trackingNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Types dérivés des schémas Zod
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type StatusChange = z.infer<typeof StatusChangeSchema>;
export type Order = z.infer<typeof OrderSchema>; 