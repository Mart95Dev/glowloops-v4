import { MetadataRoute } from 'next';
import { getSitemapEntries, SitemapEntry } from '@/lib/utils/seo-helpers';

/**
 * Génère le sitemap pour le site
 * Cette fonction est appelée automatiquement par Next.js
 * 
 * @returns Un objet compatible avec l'API de sitemap de Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Récupérer les entrées du sitemap
    const entries = await getSitemapEntries();
    
    // Convertir les entrées au format attendu par Next.js
    return entries.map((entry: SitemapEntry) => ({
      url: entry.url.startsWith('http') ? entry.url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr'}${entry.url.startsWith('/') ? entry.url : `/${entry.url}`}`,
      lastModified: entry.lastModified || new Date(),
      changeFrequency: entry.changeFrequency || 'weekly',
      priority: entry.priority || 0.7,
    }));
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // En cas d'erreur, retourner un sitemap minimal
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr'}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
} 