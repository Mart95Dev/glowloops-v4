import { Metadata } from 'next';
import { getOptimizedSrc } from './image-helpers';
import { db } from '@/lib/firebase/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  alternateLocales?: { locale: string; url: string }[];
}

// Interface pour les objets produit
export interface ProductSeoData {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  currentPrice?: number;
  categories?: string[];
  tags?: string[];
  image?: string;
  mainImage?: string;
  images?: Array<{url: string}>;
}

// Interface pour les objets catégorie
export interface CategorySeoData {
  id?: string;
  slug?: string;
  name: string;
  description?: string;
  tags?: string[];
  image?: string;
}

// Interface pour les entrées de sitemap
export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

type OpenGraphImages = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

// Constantes SEO pour le site
const SITE_NAME = 'GlowLoops';
const DEFAULT_TITLE = 'GlowLoops - Bijoux en résine époxy faits main';
const DEFAULT_DESCRIPTION = 'Découvrez notre collection unique de bijoux en résine époxy faits main. Bijoux personnalisables, créations originales et bijoux artisanaux de qualité.';
const DEFAULT_KEYWORDS = ['bijoux résine époxy', 'bijoux artisanaux', 'bijoux faits main', 'créations personnalisées', 'bijoux résinés', 'bijouterie en ligne'];
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowloops.fr';
const DEFAULT_OG_IMAGE = '/images/og-default.png';

/**
 * Récupère toutes les entrées pour le sitemap
 * Combine les pages statiques et dynamiques (produits, catégories)
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // 1. Ajouter les pages statiques
  const staticPages: SitemapEntry[] = [
    { url: '/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: '/boutique', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: '/a-propos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: '/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: '/mentions-legales', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: '/conditions-generales-de-vente', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: '/politique-de-confidentialite', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];
  
  entries.push(...staticPages);

  // 2. Ajouter les pages de produits depuis Firestore
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('status', '==', 'active'));
    const productsSnapshot = await getDocs(q);
    
    productsSnapshot.forEach(doc => {
      const productData = doc.data();
      const slug = productData.basic_info?.slug || doc.id;
      const updatedAt = productData.updatedAt ? new Date(productData.updatedAt) : new Date();
      
      entries.push({
        url: `/produit/${slug}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits pour le sitemap:', error);
  }

  // 3. Ajouter les pages de catégories depuis Firestore
  try {
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    categoriesSnapshot.forEach(doc => {
      const categoryData = doc.data();
      const slug = categoryData.slug || doc.id;
      const updatedAt = categoryData.updatedAt ? new Date(categoryData.updatedAt) : new Date();
      
      entries.push({
        url: `/categorie/${slug}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories pour le sitemap:', error);
  }

  return entries;
}

/**
 * Génère les métadonnées SEO pour les pages Next.js
 */
export function generateSeoMetadata({
  title,
  description,
  keywords = [],
  url,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noIndex = false,
  alternateLocales = [],
}: SeoProps = {}): Metadata {
  // Construire l'URL complète
  const canonicalUrl = url ? `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}` : BASE_URL;
  
  // Optimiser l'image OpenGraph
  const optimizedOgImage = getOptimizedSrc(ogImage, DEFAULT_OG_IMAGE);
  
  // Construire les images OpenGraph
  const images: OpenGraphImages[] = [
    {
      url: optimizedOgImage,
      width: 1200,
      height: 630,
      alt: title || DEFAULT_TITLE,
    }
  ];

  // Combinaison des mots-clés par défaut et personnalisés
  const metaKeywords = [...DEFAULT_KEYWORDS, ...keywords];

  // Pour la vérification du domaine Facebook
  const fbDomainVerification = process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION || '';

  const metadata: Metadata = {
    // Métadonnées de base
    title: title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    referrer: 'origin-when-cross-origin',
    keywords: metaKeywords,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    generator: 'Next.js',
    
    // Métadonnées pour l'indexation
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    
    // Métadonnées pour la localisation
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLocales.reduce((acc, { locale, url }) => {
        acc[locale] = url;
        return acc;
      }, {} as Record<string, string>),
    },
    
    // Métadonnées OpenGraph - corriger le type pour inclure 'product'
    openGraph: {
      // @ts-expect-error - Next.js metadata accepte 'product' mais TypeScript ne le définit pas
      type: ogType,
      title: title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      siteName: SITE_NAME,
      url: canonicalUrl,
      images,
    },
    
    // Métadonnées Twitter
    twitter: {
      card: twitterCard,
      title: title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      images: optimizedOgImage ? [optimizedOgImage] : undefined,
      site: '@glowloops',
      creator: '@glowloops',
    },
    
    // Métadonnées pour les appareils mobiles
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    
    // Métadonnées pour la vérification via les outils de webmaster
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      other: {
        'facebook-domain-verification': fbDomainVerification,
      }
    },
  };

  return metadata;
}

/**
 * Génère des métadonnées spécifiques aux produits
 */
export function generateProductSeoMetadata(product: ProductSeoData): Metadata {
  if (!product) return generateSeoMetadata();
  
  const price = product.price || product.currentPrice || 0;
  const priceText = price ? `${price}€` : '';
  
  return generateSeoMetadata({
    title: `${product.name || product.title} ${priceText}`,
    description: product.description || `Découvrez ${product.name || product.title}, un bijou en résine époxy fait main par GlowLoops. ${product.shortDescription || ''}`,
    keywords: [
      product.name || product.title || '',
      ...(product.categories || []),
      ...(product.tags || []),
      'bijou personnalisé',
      'bijou résine époxy',
    ],
    url: `/produit/${product.slug || product.id}`,
    ogType: 'product',
    ogImage: product.image || product.mainImage || (product.images && product.images.length > 0 ? product.images[0].url : undefined),
  });
}

/**
 * Génère des métadonnées spécifiques aux catégories
 */
export function generateCategorySeoMetadata(category: CategorySeoData): Metadata {
  if (!category) return generateSeoMetadata();
  
  return generateSeoMetadata({
    title: `${category.name} - Collection de bijoux en résine époxy`,
    description: category.description || `Découvrez notre collection de ${category.name}. Bijoux en résine époxy faits main, styles uniques et créations originales.`,
    keywords: [
      category.name,
      'collection bijoux',
      'bijoux résine époxy',
      ...(category.tags || []),
    ],
    url: `/categorie/${category.slug || category.id}`,
    ogType: 'website',
    ogImage: category.image,
  });
}

/**
 * Construit une URL canonique complète
 */
export function buildCanonicalUrl(path: string): string {
  if (!path) return BASE_URL;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Génère les métadonnées pour la page d'accueil
 */
export function generateHomeSeoMetadata(params: SeoProps = {}): Metadata {
  return generateSeoMetadata({
    title: 'Bijoux en résine époxy faits main',
    description: 'Découvrez notre collection unique de bijoux en résine époxy faits main. Bijoux personnalisables, créations originales et pièces personnalisées pour tous les styles.',
    url: '/',
    ...params
  });
}

/**
 * Génère les métadonnées pour la page boutique
 */
export function generateShopSeoMetadata(params: SeoProps = {}): Metadata {
  return generateSeoMetadata({
    title: 'Boutique',
    description: "Parcourez notre collection de bijoux en résine époxy faits main. Boucles d'oreilles, colliers, bracelets et plus encore, disponibles en ligne.",
    url: '/boutique',
    ...params
  });
} 