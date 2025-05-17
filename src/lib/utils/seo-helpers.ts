import { Metadata } from 'next';
import { Product } from '@/lib/types/product';

interface SeoBaseParams {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  canonical?: string;
  noindex?: boolean;
}

interface GenerateProductSeoParams extends SeoBaseParams {
  product: Product;
}

interface GenerateCategorySeoParams extends SeoBaseParams {
  categoryName: string;
  subcategory?: string;
  categoryType: 'style' | 'vibe' | 'materiaux';
}

/**
 * Génère les métadonnées de base pour toutes les pages
 */
export function generateSeoMetadata({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  canonical,
  noindex = false
}: SeoBaseParams): Metadata {
  // Valeurs par défaut pour GlowLoops
  const siteName = 'GlowLoops | Bijoux en résine époxy faits main';
  const defaultDescription = 'Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité.';
  const defaultImage = '/images/og-default.jpg';
  
  // Construction du titre avec le format approprié
  const metaTitle = title 
    ? `${title} | GlowLoops` 
    : siteName;
  
  const metadata: Metadata = {
    title: metaTitle,
    description: description || defaultDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: metaTitle,
      description: description || defaultDescription,
      url: canonical,
      siteName,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      ...(type === 'product' ? { type: 'website' } : { type }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: description || defaultDescription,
      images: [image || defaultImage],
    },
    alternates: {
      canonical: canonical,
    },
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  };

  return metadata;
}

/**
 * Génère les métadonnées pour les pages produit
 */
export function generateProductSeoMetadata({
  product,
  ...baseParams
}: GenerateProductSeoParams): Metadata {
  if (!product) {
    return generateSeoMetadata({
      title: 'Produit non trouvé',
      description: 'Le produit que vous recherchez n\'existe pas ou a été supprimé.',
      noindex: true,
      ...baseParams
    });
  }

  const name = product.name || product.basic_info?.name || '';
  const description = product.description || product.content?.short_description || `Découvrez ${name}, une création artisanale de GlowLoops.`;
  
  // Récupération des mots-clés optimisés pour le SEO
  const keywords: string[] = [];
  
  // Ajouter les tags si disponibles
  if (product.basic_info?.tags) {
    keywords.push(...product.basic_info.tags);
  }
  
  // Ajouter catégorie, collection, matériaux si disponibles
  if (product.basic_info?.categoryId) keywords.push(product.basic_info.categoryId);
  if (product.basic_info?.collection) keywords.push(product.basic_info.collection);
  
  // Type sécurisé pour specifications
  const productWithSpecs = product as Product & { specifications?: { materials?: string[] } };
  if (productWithSpecs.specifications?.materials) {
    keywords.push(...productWithSpecs.specifications.materials);
  }
  
  // Ajouter style, vibes comme mots-clés supplémentaires
  if (product.styles) {
    keywords.push(...(Array.isArray(product.styles) ? product.styles : []));
  }
  if (product.vibes) {
    const vibesArray = Array.isArray(product.vibes) 
      ? product.vibes 
      : Object.keys(product.vibes);
    keywords.push(...vibesArray);
  }
  
  // Récupération de l'image principale pour l'OG tag
  const image = product.images?.[0] || 
    product.media?.mainImageUrl || 
    product.media?.thumbnailUrl || 
    baseParams.image;
  
  return generateSeoMetadata({
    title: name,
    description,
    keywords,
    image,
    type: 'product',
    ...baseParams
  });
}

/**
 * Génère les métadonnées pour les pages de catégorie
 */
export function generateCategorySeoMetadata({
  categoryName,
  subcategory,
  categoryType,
  ...baseParams
}: GenerateCategorySeoParams): Metadata {
  // Construction dynamique du titre selon le type de catégorie
  let title: string;
  let description: string;
  
  const categoryTypeMap = {
    'style': 'Style',
    'vibe': 'Vibe',
    'materiaux': 'Matériaux'
  };
  
  const mainCategory = categoryTypeMap[categoryType];
  
  if (subcategory) {
    title = `${subcategory} | ${mainCategory}`;
    description = `Découvrez notre collection de boucles d'oreilles ${subcategory.toLowerCase()} dans notre sélection ${mainCategory.toLowerCase()}.`;
  } else {
    title = mainCategory;
    description = `Explorez notre gamme de bijoux classés par ${mainCategory.toLowerCase()} - trouvez la pièce parfaite qui correspond à votre personnalité.`;
  }
  
  // Mots-clés spécifiques à la catégorie
  const keywords = [
    mainCategory,
    categoryName,
    subcategory || '',
    'bijoux',
    'boucles d\'oreilles',
    'accessoires',
    'fait main',
    'artisanal',
    'GlowLoops'
  ].filter(Boolean);
  
  return generateSeoMetadata({
    title,
    description,
    keywords,
    ...baseParams
  });
}

/**
 * Génère les métadonnées pour la page d'accueil
 */
export function generateHomeSeoMetadata(params: SeoBaseParams = {}): Metadata {
  return generateSeoMetadata({
    title: 'Bijoux en résine époxy faits main',
    description: 'GlowLoops - Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité. Créations uniques et colorées.',
    keywords: [
      'bijoux', 
      'boucles d\'oreilles', 
      'résine époxy', 
      'fait main', 
      'artisanal', 
      'créations', 
      'accessoires', 
      'bijoux personnalisés'
    ],
    ...params
  });
}

/**
 * Génère les métadonnées pour la page boutique
 */
export function generateShopSeoMetadata(params: SeoBaseParams = {}): Metadata {
  return generateSeoMetadata({
    title: 'Boutique',
    description: 'Découvrez notre collection complète de bijoux artisanaux. Filtrez par style, vibe et matériaux pour trouver vos bijoux parfaits.',
    keywords: [
      'boutique', 
      'bijoux', 
      'collection', 
      'boucles d\'oreilles', 
      'accessoires', 
      'fait main', 
      'résine époxy'
    ],
    ...params
  });
} 