'use client';

import Script from 'next/script';

/**
 * Interface pour les éléments du fil d'Ariane
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/**
 * Composant pour générer le JSON-LD des fils d'Ariane
 * Améliore le SEO en ajoutant des données structurées pour les moteurs de recherche
 * 
 * @example
 * ```tsx
 * <BreadcrumbJsonLd 
 *   items={[
 *     { name: 'Accueil', url: '/' },
 *     { name: 'Boutique', url: '/boutique' },
 *     { name: 'Catégorie', url: '/boutique/categorie' }
 *   ]} 
 * />
 * ```
 */
export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items || items.length === 0) return null;
  
  // Construire le tableau d'éléments au format JSON-LD
  const breadcrumbItems = items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url.startsWith('http') ? item.url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr'}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
  }));
  
  // Créer l'objet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems
  };
  
  return (
    <Script id="breadcrumb-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 