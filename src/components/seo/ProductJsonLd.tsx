'use client';

import { Product } from '@/lib/types/product';
import Script from 'next/script';

interface ProductJsonLdProps {
  product: Product;
  url: string;
}

// Interface étendant Product pour les propriétés spécifiques au JSON-LD
interface ProductWithJsonLdData extends Omit<Product, 'pricing'> {
  inventory?: {
    quantity?: number;
  };
  social_proof?: {
    reviewCount?: number;
    averageRating?: number;
  };
  pricing?: {
    regular_price: number;
    sale_price?: number | null;
    currency?: string;
  };
}

export default function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  if (!product) return null;
  
  // Cast vers notre interface étendue au lieu de any
  const productData = product as ProductWithJsonLdData;
  
  // Récupérer les informations du produit
  const name = product.name || product.basic_info?.name || '';
  const description = product.description || product.content?.short_description || '';
  const imageUrl = product.images?.[0] || product.media?.mainImageUrl || '';
  const sku = product.basic_info?.sku || '';
  const brand = 'GlowLoops';
  const currency = productData.pricing?.currency || 'EUR';
  const price = product.pricing?.regular_price ? (product.pricing.regular_price / 100).toFixed(2) : null;
  // Utiliser le prix soldé pour l'offre si disponible
  const hasSalePrice = product.pricing?.sale_price !== undefined && product.pricing?.sale_price !== null;
  const currentPrice = hasSalePrice 
    ? (product.pricing!.sale_price! / 100).toFixed(2) 
    : price;
  
  // Disponibilité du produit
  const inStock = productData.inventory?.quantity !== 0;
  const availability = inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  
  // Evaluations (si disponibles)
  const hasReviews = productData.social_proof?.reviewCount && productData.social_proof.reviewCount > 0;
  
  // Créer l'objet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: imageUrl,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: currentPrice || '0.00',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability,
      seller: {
        '@type': 'Organization',
        name: 'GlowLoops'
      }
    }
  };
  
  // Ajouter les agrégations de notes si elles existent
  if (hasReviews && productData.social_proof) {
    Object.assign(jsonLd, {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productData.social_proof.averageRating || 0,
        reviewCount: productData.social_proof.reviewCount || 0
      }
    });
  }
  
  return (
    <Script id="product-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 