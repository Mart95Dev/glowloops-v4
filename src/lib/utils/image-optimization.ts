/**
 * Utilitaires pour l'optimisation des images
 * Ce fichier contient des fonctions pour optimiser les URLs d'images
 * et améliorer les performances de chargement des images.
 */

// Définition des tailles standard pour le redimensionnement des images
const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 900, height: 900 },
  banner: { width: 1200, height: 500 },
  hero: { width: 1920, height: 800 },
};

// Type pour les options d'optimisation
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  sizePreset?: keyof typeof IMAGE_SIZES;
  crop?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Convertit une URL de Firebase Storage en URL optimisée
 * Applique des paramètres d'optimisation spécifiques à Firebase Storage CDN
 * @param url - L'URL originale de l'image
 * @param options - Options d'optimisation
 * @returns L'URL optimisée pour le CDN
 */
export function getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
  if (!url) return '';

  // Valeurs par défaut
  const {
    width,
    height,
    quality = 75,
    format = 'webp',
    sizePreset,
    crop = false,
  } = options;

  // Si c'est déjà une URL Firebase Storage
  if (url.includes('firebasestorage.googleapis.com')) {
    // Nettoyer l'URL des paramètres inutiles
    const baseUrl = url.split('?')[0];
    
    // Extraire le bucket et l'objet path de l'URL
    try {
      // Format typique: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>
      const matches = baseUrl.match(/\/b\/([^/]+)\/o\/([^?]+)/);
      
      if (matches && matches.length >= 3) {
        const bucket = matches[1];
        const objectPath = decodeURIComponent(matches[2]);
        
        // Construire une URL CDN optimisée
        // Utiliser un CDN comme Firebase Cache: storage.googleapis.com est plus rapide
        let optimizedUrl = `https://storage.googleapis.com/${bucket}/${objectPath}`;
        
        // Ajouter les paramètres d'optimisation
        const params = new URLSearchParams();
        
        // Taille basée sur un preset ou sur les dimensions fournies
        if (sizePreset && IMAGE_SIZES[sizePreset]) {
          params.append('w', IMAGE_SIZES[sizePreset].width.toString());
          params.append('h', IMAGE_SIZES[sizePreset].height.toString());
        } else if (width) {
          params.append('w', width.toString());
          if (height) {
            params.append('h', height.toString());
          }
        }
        
        // Qualité d'image (réduire pour améliorer la performance)
        params.append('q', quality.toString());
        
        // Format WebP pour une meilleure compression
        params.append('f', format);
        
        // Cropping si nécessaire
        if (crop) {
          params.append('c', 'crop');
        }
        
        // Ajouter les paramètres à l'URL
        if (params.toString()) {
          optimizedUrl += `?${params.toString()}`;
        }
        
        return optimizedUrl;
      }
    } catch (e) {
      console.warn('Erreur lors de l\'optimisation de l\'URL:', e);
    }
    
    // Si l'analyse de l'URL a échoué, retourner l'URL de base avec alt=media
    return `${baseUrl}?alt=media`;
  }
  
  // Si c'est une URL Storage avec token complet
  if (url.includes('storage.googleapis.com')) {
    // Ajouter des paramètres d'optimisation à l'URL Storage
    const urlObj = new URL(url);
    
    // Paramètres d'optimisation
    if (sizePreset && IMAGE_SIZES[sizePreset]) {
      urlObj.searchParams.set('w', IMAGE_SIZES[sizePreset].width.toString());
      urlObj.searchParams.set('h', IMAGE_SIZES[sizePreset].height.toString());
    } else if (width) {
      urlObj.searchParams.set('w', width.toString());
      if (height) {
        urlObj.searchParams.set('h', height.toString());
      }
    }
    
    // Qualité d'image
    urlObj.searchParams.set('q', quality.toString());
    
    // Format WebP pour une meilleure compression
    urlObj.searchParams.set('f', format);
    
    // Cropping si nécessaire
    if (crop) {
      urlObj.searchParams.set('c', 'crop');
    }
    
    return urlObj.toString();
  }
  
  // Si l'URL est une URL relative à /images
  if (url.startsWith('/images')) {
    // Les images locales sont déjà optimisées par Next.js
    return url;
  }

  // Pour les autres types d'URLs (cas par défaut)
  return url;
}

/**
 * Détermine les attributs de préchargement pour les images critiques
 * @param url - L'URL de l'image
 * @param isCritical - Si l'image est critique pour le LCP
 * @returns Attributs pour le préchargement des images
 */
export function getImagePreloadProps(url: string, isCritical: boolean = false) {
  if (!isCritical || !url) return {};

  // Déterminer le type MIME basé sur l'extension
  let type = 'image/jpeg'; // par défaut
  if (url.includes('.webp') || url.includes('f=webp')) type = 'image/webp';
  if (url.includes('.avif') || url.includes('f=avif')) type = 'image/avif';
  if (url.includes('.png')) type = 'image/png';
  if (url.includes('.svg')) type = 'image/svg+xml';

  return {
    rel: 'preload',
    as: 'image',
    href: url,
    type,
    fetchPriority: 'high' as const,
    imagesrcset: generateSrcSet(url), // Ajouter un srcset pour le responsive
  };
}

/**
 * Génère un srcset pour le chargement responsive des images
 * @param url - L'URL de base de l'image
 * @returns Une chaîne srcset pour le préchargement
 */
function generateSrcSet(url: string): string {
  if (!url || (!url.includes('firebasestorage.googleapis.com') && !url.includes('storage.googleapis.com'))) {
    return '';
  }
  
  // Générer des variantes pour différentes tailles d'écran
  try {
    const widths = [375, 640, 750, 828, 1080, 1200, 1920];
    const srcSetEntries = widths.map(w => {
      // Optimisation pour chaque largeur
      const optimizedUrl = getOptimizedImageUrl(url, { 
        width: w, 
        format: 'webp',
        quality: 75
      });
      return `${optimizedUrl} ${w}w`;
    });
    
    return srcSetEntries.join(', ');
  } catch (e) {
    console.warn('Erreur lors de la génération du srcset:', e);
    return '';
  }
}

/**
 * Génère des métadonnées appropriées pour le téléchargement vers Firebase Storage
 * Utiliser lors du téléchargement de nouvelles images
 * @param contentType - Type MIME du fichier
 * @param isPublic - Si le fichier doit être public
 * @returns Les métadonnées optimisées pour Firebase Storage
 */
export function getStorageMetadata(contentType: string, isPublic: boolean = true) {
  return {
    contentType,
    cacheControl: isPublic 
      ? 'public, max-age=31536000, s-maxage=31536000' // Cache d'un an pour les fichiers publics avec CDN
      : 'private, max-age=3600',   // Cache d'une heure pour les fichiers privés
    customMetadata: {
      'firebaseStorageDownloadTokens': generateRandomToken(),
    }
  };
}

/**
 * Génère un token aléatoire pour les téléchargements Firebase Storage
 * Cela permet d'avoir des URLs stables pour le cache
 */
function generateRandomToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
} 