'use client';

import Script from 'next/script';

interface OrganizationJsonLdProps {
  url: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
  sameAs?: string[];
}

export default function OrganizationJsonLd({
  url,
  logo = '/images/logo/glowloops-logo.webp',
  contactPoint,
  sameAs = []
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GlowLoops',
    url,
    logo,
    description: 'Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité.',
    sameAs,
  };
  
  // Ajouter le point de contact s'il est fourni
  if (contactPoint) {
    Object.assign(jsonLd, {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contactPoint.telephone,
        contactType: contactPoint.contactType,
        areaServed: contactPoint.areaServed || 'FR',
        availableLanguage: contactPoint.availableLanguage || ['French']
      }
    });
  }
  
  return (
    <Script id="organization-jsonld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
} 