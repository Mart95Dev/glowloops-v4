/**
 * Utilitaires pour travailler avec Firebase Storage
 */

import { getStorageFileUrl } from '../firebase/firebase-config';

// Tailles d'image prédéfinies pour l'optimisation
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

export interface OptimizationOptions {
  size?: ImageSize;
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  quality?: number;
}

// Dimensions pour chaque taille d'image
const SIZE_DIMENSIONS: Record<ImageSize, { width: number; height: number }> = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  original: { width: 0, height: 0 }, // Pas de redimensionnement
};

// Cache pour les URLs optimisées - évite de recréer les mêmes URLs
const urlCache = new Map<string, string>();
const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes

/**
 * Extrait le chemin du fichier à partir d'une URL Firebase Storage
 * @param url - URL complète du fichier Firebase Storage
 * @returns Chemin du fichier dans Firebase Storage
 */
export const extractStoragePath = (url: string): string => {
  try {
    // Vérifier si l'URL est valide avant de la traiter
    if (!url) return '';
    
    // Gérer le cas où l'URL pourrait être relative ou mal formatée
    if (!url.startsWith('http')) {
      // Si c'est un chemin relatif, le retourner directement
      return url.startsWith('/') ? url.substring(1) : url;
    }
    
    // Format de l'URL: https://storage.googleapis.com/[bucket]/[path]?[params]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Ignorer le premier élément vide et le nom du bucket
    const path = pathParts.slice(2).join('/');
    
    return path;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du chemin de stockage:', error);
    console.log('URL problématique:', url);
    // Retourner l'URL originale ou un chemin par défaut pour éviter la propagation d'erreurs
    return url && typeof url === 'string' ? url : '';
  }
};

/**
 * Génère une clé de cache unique pour une URL et des options d'optimisation
 */
const getCacheKey = (url: string, options: OptimizationOptions): string => {
  const { size = 'medium', format = 'webp', quality = 75 } = options;
  return `${url}_${size}_${format}_${quality}`;
};

/**
 * Optimise une URL Firebase Storage pour le chargement d'image
 * Ajoute des paramètres pour la compression, le format et le redimensionnement
 * @param url - URL d'image Firebase
 * @param options - Options d'optimisation
 * @returns URL optimisée
 */
export const optimizeFirebaseUrl = (
  url: string,
  options: OptimizationOptions = { size: 'medium', format: 'webp', quality: 75 }
): string => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Si l'URL est vide ou non Firebase, la retourner telle quelle
  if (!url || (!url.includes('firebasestorage.googleapis.com') && !url.includes('storage.googleapis.com'))) {
    return url;
  }
  
  // Application des valeurs par défaut pour éviter les valeurs undefined
  const { size = 'medium', format = 'webp', quality = 75 } = options;
  
  // Vérifier si l'URL est déjà dans le cache
  const cacheKey = getCacheKey(url, { size, format, quality });
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey) || url;
  }
  
  try {
    const urlObj = new URL(url);
    
    // Vérifier si c'est bien une URL Firebase
    if (!urlObj.hostname.includes('firebasestorage.googleapis.com') && 
        !urlObj.hostname.includes('storage.googleapis.com')) {
      return url;
    }
    
    // S'assurer que alt=media est présent (obligatoire pour Firebase Storage)
    if (!urlObj.searchParams.has('alt')) {
      urlObj.searchParams.append('alt', 'media');
    }
    
    // Taille d'image
    if (size !== 'original') {
      const dimensions = SIZE_DIMENSIONS[size];
      urlObj.searchParams.append('w', dimensions.width.toString());
      urlObj.searchParams.append('h', dimensions.height.toString());
    }
    
    // Format d'image (webp ou avif par défaut pour la compression)
    if (format !== 'auto') {
      urlObj.searchParams.append('format', format);
    }
    
    // Qualité d'image (75% par défaut pour un bon compromis)
    urlObj.searchParams.append('q', quality.toString());
    
    // Log pour le débogage en développement
    if (!isProd) {
      console.log(`[StorageHelper] URL Firebase optimisée: ${urlObj.toString()}`);
    }
    
    const optimizedUrl = urlObj.toString();
    
    // Mettre en cache l'URL optimisée
    urlCache.set(cacheKey, optimizedUrl);
    
    // Définir l'expiration du cache
    setTimeout(() => {
      urlCache.delete(cacheKey);
    }, CACHE_EXPIRATION);
    
    return optimizedUrl;
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'URL:', error);
    return url; // En cas d'erreur, renvoyer l'URL originale
  }
};

/**
 * Génère une nouvelle URL publique pour un fichier Firebase Storage
 * @param url - URL actuelle du fichier
 * @param options - Options d'optimisation pour l'image
 * @returns Promise avec la nouvelle URL publique optimisée
 */
export const refreshStorageUrl = async (
  url: string, 
  options?: OptimizationOptions
): Promise<string> => {
  // Vérifier si l'URL est valide
  if (!url) {
    console.error('URL d\'image manquante ou invalide');
    // Retourner une URL par défaut pour éviter les erreurs
    return 'https://firebasestorage.googleapis.com/v0/b/glowloops-v3.appspot.com/o/placeholder.png?alt=media';
  }
  
  // Si ce n'est pas une URL Firebase Storage, la retourner telle quelle
  if (!url.includes('storage.googleapis.com') && !url.includes('firebasestorage.googleapis.com')) {
    return url;
  }
  
  try {
    // Extraire le chemin du fichier
    const path = extractStoragePath(url);
    if (!path) {
      console.warn('Impossible d\'extraire le chemin du fichier:', url);
      return url;
    }
    
    // Générer une nouvelle URL
    const newUrl = await getStorageFileUrl(path);
    if (!newUrl) {
      console.warn('Impossible de générer une nouvelle URL pour:', path);
      return url;
    }
    
    // Optimiser l'URL si des options sont fournies
    if (options) {
      return optimizeFirebaseUrl(newUrl, options);
    }
    
    return newUrl;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement de l\'URL:', error);
    return url;
  }
};
