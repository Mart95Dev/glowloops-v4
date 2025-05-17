import { NextResponse } from 'next/server';
import { getSitemapEntries } from '@/lib/utils/seo-helpers';

/**
 * Génère dynamiquement un fichier sitemap.xml
 * @returns Réponse XML contenant le sitemap
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Récupérer l'URL de base depuis les variables d'environnement
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr';
    
    // Récupérer toutes les entrées du sitemap (pages statiques et dynamiques)
    const entries = await getSitemapEntries();
    
    // Générer le XML du sitemap
    const xmlContent = generateSitemapXml(entries, baseUrl);
    
    // Retourner le XML avec les bons en-têtes
    return new NextResponse(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du sitemap' },
      { status: 500 }
    );
  }
}

/**
 * Génère le XML du sitemap à partir des entrées
 */
function generateSitemapXml(entries: Array<{
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>, baseUrl: string): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.map(entry => {
    const url = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url.startsWith('/') ? entry.url : `/${entry.url}`}`;
    return `<url>
    <loc>${url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority !== undefined ? `<priority>${entry.priority.toFixed(1)}</priority>` : ''}
  </url>`;
  }).join('\n  ')}
</urlset>`;

  return xml;
} 