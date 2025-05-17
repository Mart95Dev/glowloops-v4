/**
 * Utilitaires avancés pour l'optimisation des images Firebase Storage
 * Inclut des fonctions pour le préchargement, la mise en cache et l'optimisation
 * Spécialement conçu pour améliorer les performances LCP et TTI
 */

import { ImageOptimizationOptions } from './image-optimization';

// Cache côté client pour les URLs
const imageCache = new Map<string, { url: string, timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

// Types d'images pour les préchargements différenciés
export type ImageType = 'hero' | 'product' | 'collection' | 'thumbnail' | 'avatar';

// Options d'image par type
const DEFAULT_OPTIONS: Record<ImageType, ImageOptimizationOptions> = {
  hero: {
    sizePreset: 'hero',
    quality: 85,
    format: 'webp',
    fetchPriority: 'high'
  },
  product: {
    sizePreset: 'large',
    quality: 75,
    format: 'webp',
  },
  collection: {
    sizePreset: 'banner',
    quality: 75,
    format: 'webp',
  },
  thumbnail: {
    sizePreset: 'thumbnail',
    quality: 70,
    format: 'webp',
  },
  avatar: {
    sizePreset: 'small',
    quality: 70,
    format: 'webp',
    crop: true
  }
};

/**
 * Optimise et met en cache une URL d'image Firebase Storage
 * @param url URL d'origine de l'image
 * @param type Type d'image pour appliquer des options par défaut
 * @param customOptions Options personnalisées (surcharge celles du type)
 * @returns URL optimisée
 */
export function optimizeFirebaseImage(
  url: string, 
  type: ImageType = 'product',
  customOptions: Partial<ImageOptimizationOptions> = {}
): string {
  if (!url) return '';
  
  // Vérifier si l'URL est une URL Firebase
  if (!url.includes('firebasestorage.googleapis.com') && !url.includes('storage.googleapis.com')) {
    return url; // Retourner l'URL telle quelle si ce n'est pas une URL Firebase
  }
  
  // Créer un identifiant de cache
  const cacheKey = getCacheKey(url, type, customOptions);
  
  // Vérifier si l'URL est dans le cache et si elle est encore valide
  const cachedEntry = imageCache.get(cacheKey);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) {
    return cachedEntry.url;
  }
  
  try {
    // Combiner les options par défaut du type avec les options personnalisées
    const options = { ...DEFAULT_OPTIONS[type], ...customOptions };
    
    // Construire l'URL optimisée
    const optimizedUrl = buildOptimizedFirebaseUrl(url, options);
    
    // Mettre en cache l'URL optimisée
    imageCache.set(cacheKey, { url: optimizedUrl, timestamp: Date.now() });
    
    return optimizedUrl;
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'URL Firebase:', error);
    return url; // En cas d'erreur, retourner l'URL d'origine
  }
}

/**
 * Précharge une image Firebase pour améliorer le LCP
 * @param url URL d'origine de l'image
 * @param type Type d'image
 * @param critical Si l'image est critique pour le LCP
 * @returns Attributs pour le préchargement à utiliser avec <link>
 */
export function getPreloadFirebaseImageProps(url: string, type: ImageType, critical: boolean = false): Record<string, string> {
  if (!url || !critical) return {};
  
  const optimizedUrl = optimizeFirebaseImage(url, type, { 
    fetchPriority: 'high',
    quality: type === 'hero' ? 85 : 75 
  });
  
  // Déterminer le type MIME basé sur l'extension ou le format
  let mimeType = 'image/jpeg'; // par défaut
  if (url.includes('.webp') || url.includes('f=webp')) mimeType = 'image/webp';
  if (url.includes('.avif') || url.includes('f=avif')) mimeType = 'image/avif';
  if (url.includes('.png')) mimeType = 'image/png';
  if (url.includes('.svg')) mimeType = 'image/svg+xml';
  
  // Retourner un objet avec les attributs pour un élément <link>
  return {
    rel: 'preload',
    as: 'image',
    href: optimizedUrl,
    fetchPriority: 'high',
    type: mimeType,
    imageSrcSet: generateFirebaseSrcSet(url, type),
  };
}

/**
 * Génère un srcset pour une image Firebase
 * @param url URL d'origine
 * @param type Type d'image
 * @returns Chaîne srcset pour le composant Image
 */
export function generateFirebaseSrcSet(url: string, type: ImageType): string {
  if (!url) return '';
  
  // Définir les largeurs en fonction du type d'image
  let widths: number[] = [];
  
  switch (type) {
    case 'hero':
      widths = [375, 640, 768, 1024, 1280, 1920];
      break;
    case 'product':
      widths = [320, 640, 750, 828, 1080];
      break;
    case 'collection':
      widths = [320, 640, 768, 1024];
      break;
    case 'thumbnail':
      widths = [100, 200, 300];
      break;
    case 'avatar':
      widths = [64, 128, 256];
      break;
  }
  
  // Générer le srcset
  const srcSet = widths.map(width => {
    const height = type === 'hero' 
      ? Math.floor(width * 0.42) // Ratio 21:9 pour les héros
      : type === 'product' 
        ? Math.floor(width) // Ratio 1:1 pour les produits
        : undefined; // Auto pour les autres
        
    const optimizedUrl = optimizeFirebaseImage(url, type, { width, height });
    return `${optimizedUrl} ${width}w`;
  }).join(', ');
  
  return srcSet;
}

/**
 * Construire une URL Firebase Storage optimisée
 */
function buildOptimizedFirebaseUrl(url: string, options: ImageOptimizationOptions): string {
  // Si c'est une URL Firebase Storage standard
  if (url.includes('firebasestorage.googleapis.com')) {
    const baseUrl = url.split('?')[0];
    
    // Extraire le bucket et le chemin
    const matches = baseUrl.match(/\/b\/([^/]+)\/o\/([^?]+)/);
    
    if (matches && matches.length >= 3) {
      const bucket = matches[1];
      const objectPath = decodeURIComponent(matches[2]);
      
      // Utiliser storage.googleapis.com qui est plus rapide (CDN optimisé)
      const optimizedUrl = `https://storage.googleapis.com/${bucket}/${objectPath}`;
      
      // Ajouter les paramètres d'optimisation
      return applyOptimizationParams(optimizedUrl, options);
    }
    
    // Si l'analyse échoue, ajouter alt=media qui est requis
    return `${baseUrl}?alt=media`;
  }
  
  // Si c'est déjà une URL storage.googleapis.com
  if (url.includes('storage.googleapis.com')) {
    return applyOptimizationParams(url, options);
  }
  
  return url;
}

/**
 * Applique les paramètres d'optimisation à une URL
 */
function applyOptimizationParams(url: string, options: ImageOptimizationOptions): string {
  const urlObj = new URL(url);
  const { 
    width, 
    height, 
    quality = 75, 
    format = 'webp',
    sizePreset,
    crop = false,
  } = options;
  
  // Définitions des tailles par preset
  const PRESET_SIZES = {
    thumbnail: { width: 100, height: 100 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 900, height: 900 },
    banner: { width: 1200, height: 500 },
    hero: { width: 1920, height: 800 },
  };
  
  // Appliquer les dimensions
  if (sizePreset && PRESET_SIZES[sizePreset]) {
    urlObj.searchParams.set('w', PRESET_SIZES[sizePreset].width.toString());
    urlObj.searchParams.set('h', PRESET_SIZES[sizePreset].height.toString());
  } else if (width) {
    urlObj.searchParams.set('w', width.toString());
    if (height) {
      urlObj.searchParams.set('h', height.toString());
    }
  }
  
  // Qualité
  urlObj.searchParams.set('q', quality.toString());
  
  // Format
  urlObj.searchParams.set('f', format);
  
  // Mode de recadrage
  if (crop) {
    urlObj.searchParams.set('c', 'crop');
    urlObj.searchParams.set('g', 'center'); // Gravité centrée
  }
  
  // S'assurer que alt=media est présent (obligatoire pour Firebase Storage)
  if (!urlObj.searchParams.has('alt')) {
    urlObj.searchParams.set('alt', 'media');
  }
  
  return urlObj.toString();
}

/**
 * Génère une clé de cache unique pour une URL et des options
 */
function getCacheKey(url: string, type: ImageType, options: Partial<ImageOptimizationOptions>): string {
  return `${url}_${type}_${JSON.stringify(options)}`;
}

/**
 * Crée un objet avec les tailles responsives appropriées pour le composant Image
 */
export function getResponsiveSizes(type: ImageType): string {
  switch (type) {
    case 'hero':
      return '100vw';
    case 'product':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'collection':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
    case 'thumbnail':
      return '(max-width: 640px) 33vw, 100px';
    case 'avatar':
      return '(max-width: 640px) 64px, 128px';
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
}

/**
 * Purger le cache lors d'un changement de page (dans les composants utilisant le cache)
 */
export function purgeImageCache(): void {
  const now = Date.now();
  
  // Supprimer les entrées expirées
  imageCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_DURATION) {
      imageCache.delete(key);
    }
  });
} 