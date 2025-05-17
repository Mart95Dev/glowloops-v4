'use client';

import Script from 'next/script';

interface OrganizationJsonLdProps {
  name?: string;
  logo?: string;
  url?: string;
  description?: string;
  sameAs?: string[];
  address?: {
    streetAddress?: string;
    postalCode?: string;
    addressLocality?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
}

// Type pour l'objet JSON-LD
interface OrganizationJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  address?: {
    '@type': string;
    streetAddress?: string;
    postalCode?: string;
    addressLocality?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': string;
    telephone?: string;
    email?: string;
    contactType?: string;
  };
}

/**
 * Composant pour générer le JSON-LD d'organisation
 * Améliore le SEO en ajoutant des données structurées sur l'entreprise
 * 
 * @example
 * ```tsx
 * <OrganizationJsonLd
 *   name="GlowLoops"
 *   logo="/images/logo.png"
 *   url="https://glowloops.fr"
 *   sameAs={["https://instagram.com/glowloops", "https://facebook.com/glowloops"]}
 * />
 * ```
 */
export default function OrganizationJsonLd({
  name = 'GlowLoops',
  logo = '/images/logo.png',
  url = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr',
  description = 'Créations artisanales de bijoux en résine époxy faits main.',
  sameAs = [],
  address,
  contactPoint
}: OrganizationJsonLdProps) {
  // Construire l'URL du logo
  const logoUrl = logo.startsWith('http') 
    ? logo 
    : `${url}${logo.startsWith('/') ? logo : `/${logo}`}`;
  
  // Créer l'objet JSON-LD
  const jsonLd: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': name,
    'url': url,
    'logo': logoUrl,
    'description': description,
  };
  
  // Ajouter les liens vers les réseaux sociaux
  if (sameAs && sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }
  
  // Ajouter l'adresse si définie
  if (address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      ...address
    };
  }
  
  // Ajouter le point de contact si défini
  if (contactPoint) {
    jsonLd.contactPoint = {
      '@type': 'ContactPoint',
      ...contactPoint
    };
  }
  
  return (
    <Script id="organization-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 