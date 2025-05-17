/**
 * Utilitaires pour l'optimisation des images
 */

/**
 * Vérifie si une URL est valide
 */
export const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

/**
 * Normalise une URL d'image pour s'assurer qu'elle est correctement formatée
 */
export const normalizeImageUrl = (url: string | null | undefined, fallbackUrl: string): string => {
  if (!url || !isValidUrl(url)) {
    return fallbackUrl;
  }
  
  // Si l'URL contient déjà un paramètre alt=media, retourne telle quelle
  if (url.includes('alt=media')) {
    return url;
  }
  
  // Si c'est une URL Firebase Storage sans le paramètre alt=media, l'ajouter
  if (url.includes('firebasestorage.googleapis.com') && !url.includes('?')) {
    return `${url}?alt=media`;
  }
  
  return url;
};

/**
 * Génère une URL d'image optimisée pour Next.js Image
 */
export const getOptimizedSrc = (src: string | null | undefined, fallbackSrc: string = '/images/default-product.png'): string => {
  return normalizeImageUrl(src, fallbackSrc);
};

/**
 * Génère des valeurs de taille responsives pour les images
 */
export const getResponsiveSizes = (type: 'thumbnail' | 'product' | 'banner' | 'avatar' | 'gallery' = 'product'): string => {
  switch (type) {
    case 'thumbnail':
      return '(max-width: 640px) 80px, 120px';
    case 'product':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'banner':
      return '100vw';
    case 'avatar':
      return '(max-width: 640px) 32px, 48px';
    case 'gallery':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
};

/**
 * Constantes pour des placeholders d'images
 */
export const IMAGE_PLACEHOLDERS = {
  PRODUCT: '/images/default-product.png',
  BANNER: '/images/default-banner.jpg',
  AVATAR: '/images/default-avatar.png',
  LOGO: '/images/logo.png',
};

/**
 * Génère un placeholder blurDataURL en base64
 */
export const generateBlurPlaceholder = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg==';
}; 