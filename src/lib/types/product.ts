import { z } from 'zod';

// Schéma pour les informations de base du produit
const BasicInfoSchema = z.object({
  name: z.string(),
  sku: z.string(),
  slug: z.string(),
  categoryId: z.string(),
  collection: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.object({
    seconds: z.number(),
    nanoseconds: z.number()
  }).optional(),
  updatedAt: z.object({
    seconds: z.number(),
    nanoseconds: z.number()
  }).optional()
});

// Schéma pour les informations de prix
const PricingSchema = z.object({
  regular_price: z.number(),
  sale_price: z.number().optional().nullable(),
  cost_price: z.number().optional(),
  currency: z.string().default('EUR'),
  discount_eligible: z.boolean().optional(),
  tax_category: z.string().optional()
});

// Schéma pour les médias
const MediaSchema = z.object({
  mainImageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  galleryImageUrls: z.record(z.string()).optional(),
  modelWearingImageUrls: z.record(z.string()).optional(),
  customerPhotos: z.record(z.object({
    url: z.string(),
    customerName: z.string(),
    rating: z.number()
  })).optional(),
  howToWearImages: z.record(z.object({
    url: z.string(),
    caption: z.string().optional()
  })).optional()
});

// Schéma pour le contenu
const ContentSchema = z.object({
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  selling_points: z.record(z.string()).optional(),
  style_tips: z.record(z.string()).optional(),
  occasion: z.record(z.string()).optional()
});

// Schéma pour l'inventaire
const InventorySchema = z.object({
  quantity: z.number().optional().nullable(),
  track_inventory: z.boolean().optional(),
  low_stock_threshold: z.number().optional(),
  preorder_allowed: z.boolean().optional(),
  backorder_allowed: z.boolean().optional(),
  estimated_shipping_days: z.number().optional()
});

// Schéma pour les spécifications
const SpecificationsSchema = z.object({
  dimensions_mm: z.object({
    height: z.number().optional(),
    width: z.number().optional(),
    length: z.number().optional()
  }).optional(),
  weight_g: z.number().optional(),
  materials: z.array(z.string()).optional(),
  closure_type: z.string().optional(),
  metal_type: z.string().optional(),
  plating: z.string().optional(),
  is_nickel_free: z.boolean().optional(),
  is_lead_free: z.boolean().optional()
});

// Schéma Zod pour la validation des produits
export const ProductSchema = z.object({
  id: z.string(),
  basic_info: BasicInfoSchema,
  pricing: PricingSchema,
  media: MediaSchema.optional(),
  content: ContentSchema.optional(),
  inventory: InventorySchema.optional(),
  specifications: SpecificationsSchema.optional(),
  status: z.string().default('active'),
  type: z.string().default('jewelry'),
  isNew: z.boolean().optional(),
  popularity: z.number().optional(),
  collections: z.array(z.string()).optional(),
  vibes: z.record(z.string()).optional(),
  tendances: z.record(z.string()).optional(),
  social_proof: z.object({
    averageRating: z.number().optional(),
    reviewCount: z.number().optional()
  }).optional(),
  shipping: z.object({
    weight_g: z.number().optional(),
    requires_shipping: z.boolean().optional(),
    free_shipping: z.boolean().optional()
  }).optional(),
  supplierInfo: z.object({
    supplierId: z.string().optional(),
    supplierProductId: z.string().optional(),
    supplierProductUrl: z.string().optional().nullable(),
    lastSyncAt: z.any().optional().nullable()
  }).optional(),
  variations: z.record(z.any()).optional(),
  isCustomizable: z.boolean().optional(),
  customizationOptions: z.array(z.any()).optional(),
  related: z.object({
    crossSellProductIds: z.record(z.string()).optional()
  }).optional(),
  seo: z.object({
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.record(z.string()).optional(),
    search_terms: z.record(z.string()).optional()
  }).optional()
});

// Type TypeScript dérivé du schéma Zod
export type ProductZod = z.infer<typeof ProductSchema>;

// Interface pour les produits utilisée dans les pages de catégorie
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categories?: string[];
  styles?: string[];
  vibes?: string[];
  materials?: string[];
  isNew?: boolean;
  discount?: number;
  popularity?: number;
  createdAt: Date;
  updatedAt: Date;
  // Ajout des propriétés pour compatibilité avec ProductZod
  basic_info?: {
    name: string;
    slug?: string;
    sku: string;
    categoryId: string;
    collection: string;
    tags?: string[];
  };
  media?: {
    mainImageUrl?: string;
    thumbnailUrl?: string;
    galleryImageUrls?: Record<string, string>;
  };
  pricing?: {
    regular_price: number;
    sale_price?: number | null;
  };
}

// Interface pour l'affichage des produits avec les propriétés supplémentaires
export interface ProductDisplay extends Product {
  isInCart?: boolean;
  isInWishlist?: boolean;
  quantity?: number;
}
