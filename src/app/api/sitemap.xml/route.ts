import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { navigationData } from '@/lib/data/navigation-data';

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

export async function GET() {
  const baseUrl = getBaseUrl();
  
  // Initialiser le contenu XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Ajouter les pages statiques
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/shop', priority: 0.9, changefreq: 'daily' },
    { url: '/panier', priority: 0.8, changefreq: 'daily' },
    { url: '/mon-compte', priority: 0.7, changefreq: 'weekly' },
    // Ajouter d'autres pages statiques ici
  ];

  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Ajouter les pages de produits
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('status', '==', 'active'));
    const productsSnapshot = await getDocs(q);
    
    productsSnapshot.forEach(doc => {
      const productData = doc.data();
      const slug = productData.basic_info?.slug || doc.id;
      
      xml += `
  <url>
    <loc>${baseUrl}/produits/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits pour le sitemap:', error);
  }

  // Ajouter les pages de catégories
  try {
    // Parcourir les données de navigation pour les catégories Style, Vibe, Matériaux
    navigationData.forEach(category => {
      // Ajouter la page principale de la catégorie
      if (['Style', 'Vibe', 'Matériaux'].includes(category.name)) {
        const categorySlug = category.name.toLowerCase();
        
        xml += `
  <url>
    <loc>${baseUrl}/${categorySlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        
        // Ajouter les sous-catégories
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            const subcategoryPath = subcategory.href;
            
            xml += `
  <url>
    <loc>${baseUrl}${subcategoryPath}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
          });
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération des liens de catégorie pour le sitemap:', error);
  }

  // Fermer la balise urlset
  xml += `
</urlset>`;

  // Retourner le sitemap sous forme de réponse XML
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
} 