import { MetadataRoute } from 'next';

/**
 * Génère le fichier robots.txt pour le site
 * Cette fonction est appelée automatiquement par Next.js 
 * lors de la génération de la route /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  // Récupérer l'URL du site depuis les variables d'environnement
  // ou utiliser une URL par défaut
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr';

  return {
    // Règles pour tous les robots
    rules: {
      userAgent: '*',
      allow: '/',
      // Interdire l'accès aux pages d'administration et de test
      disallow: [
        '/admin/',
        '/test-*',
        '/api/',
        '/checkout/confirmation',
        '/mon-compte/',
      ],
    },
    // Chemin vers le sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
    // Options supplémentaires
    host: baseUrl,
  };
} 