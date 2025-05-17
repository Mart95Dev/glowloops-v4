'use client';

import Script from 'next/script';

export interface CategoryJsonLdProps {
  name: string;
  description?: string;
  url: string;
  image?: string;
  numberOfItems?: number;
  itemListElements?: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
    price?: string;
  }>;
}

/**
 * Composant pour générer le JSON-LD de catégorie (ItemList)
 * Améliore le SEO en ajoutant des données structurées pour les catégories/collections
 * 
 * @example
 * ```tsx
 * <CategoryJsonLd
 *   name="Mini-hoops"
 *   description="Nos mini-hoops en résine époxy, légères et colorées."
 *   url="/boutique/style/mini-hoops"
 *   image="/images/categories/mini-hoops.jpg"
 *   itemListElements={products.map(p => ({
 *     name: p.name,
 *     url: `/produit/${p.slug}`,
 *     image: p.image,
 *     price: `${p.price}€`
 *   }))}
 * />
 * ```
 */
export default function CategoryJsonLd({
  name,
  description,
  url,
  image,
  numberOfItems = 0,
  itemListElements = []
}: CategoryJsonLdProps) {
  if (!name || !url) return null;
  
  // Construire l'URL complète
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  
  // Construire le tableau d'éléments au format JSON-LD
  const items = itemListElements.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'item': {
      '@type': 'Product',
      'name': item.name,
      'description': item.description,
      'url': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
      ...(item.image && { 'image': item.image.startsWith('http') ? item.image : `${baseUrl}${item.image.startsWith('/') ? item.image : `/${item.image}`}` }),
      ...(item.price && { 'offers': { '@type': 'Offer', 'price': item.price.replace('€', ''), 'priceCurrency': 'EUR' } })
    }
  }));
  
  // Créer l'objet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': name,
    'description': description,
    'url': fullUrl,
    'numberOfItems': numberOfItems || items.length,
    ...(image && { 'image': image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}` }),
    'itemListElement': items
  };
  
  return (
    <Script id="category-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 