import { MetadataRoute } from 'next';

// Fonction utilitaire simplifiée qui évite l'utilisation de l'objet URL
const getBaseUrl = (): string => {
  // Utiliser directement la variable d'environnement si elle existe
  if (process.env.NEXT_PUBLIC_SITE_URL && typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim();
  }
  
  // Utiliser localhost en développement, URL de production par défaut sinon
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://glowloops.com';
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/mon-compte/',
        '/panier/',
        '/paiement/',
        '/test/',
        '/_next/',
        // Ajoutez ici d'autres chemins à ne pas indexer
      ],
    },
    sitemap: `${baseUrl}/api/sitemap.xml`,
  };
} 