'use client';

import Script from 'next/script';

interface CategoryJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  productCount?: number;
}

export default function CategoryJsonLd({
  name,
  description,
  url,
  image,
  productCount
}: CategoryJsonLdProps) {
  // Créer l'objet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
  
  // Ajouter l'image si disponible
  if (image) {
    Object.assign(jsonLd, { image });
  }
  
  // Ajouter le nombre de produits si disponible
  if (productCount !== undefined) {
    Object.assign(jsonLd, { 
      numberOfItems: productCount,
      itemListOrder: 'https://schema.org/ItemListOrderDescending'
    });
  }
  
  return (
    <Script id="category-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 