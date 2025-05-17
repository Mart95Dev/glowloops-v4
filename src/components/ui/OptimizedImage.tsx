'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface OptimizedImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoad?: () => void;
  fallbackSrc?: string;
  eager?: boolean;
  blur?: boolean;
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  ratio?: 'portrait' | 'landscape' | 'square' | 'auto';
}

const DEFAULT_FALLBACK = '/images/default-product.png';

// Constante pour le placeholder - définie en dehors du composant pour éviter les recalculs
const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 70,
  className,
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  fallbackSrc = DEFAULT_FALLBACK,
  eager = false,
  blur = true,
  format = 'webp',
  ratio = 'auto',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialiser la source au montage du composant
  useEffect(() => {
    if (!src || src.trim() === '') {
      setImgSrc(fallbackSrc);
      return;
    }
    
    // Fonction optimisée pour traiter les URLs Firebase
    const optimizeFirebaseUrl = (url: string): string => {
      if (!url) return fallbackSrc;
      
      // Vérifier si c'est une URL Firebase Storage et l'optimiser
      if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
        try {
          const optimizedUrl = new URL(url);
          
          // S'assurer que l'URL a le paramètre alt=media
          if (!optimizedUrl.searchParams.has('alt')) {
            optimizedUrl.searchParams.set('alt', 'media');
          }
          
          // Ajouter le format si supporté
          if (format !== 'auto') {
            optimizedUrl.searchParams.set('format', format);
          }
          
          // Définir la qualité pour réduire la taille du fichier
          optimizedUrl.searchParams.set('q', quality.toString());
          
          return optimizedUrl.toString();
        } catch {
          // En cas d'erreur dans l'URL, retourner l'URL d'origine
          return url;
        }
      }
      
      return url;
    };
    
    // Optimiser l'URL Firebase si applicable
    const optimizedSrc = optimizeFirebaseUrl(src);
    setImgSrc(optimizedSrc);
  }, [src, fallbackSrc, format, quality]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else if (fallbackSrc !== DEFAULT_FALLBACK) {
      setImgSrc(DEFAULT_FALLBACK);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Déterminer la valeur de loading selon les props
  const loadingStrategy = priority || eager ? 'eager' : 'lazy';
  
  // Utiliser fetchPriority si c'est priority
  const fetchPriorityValue = priority ? 'high' : 'auto';
  
  // Fusionner les styles pour s'assurer que les dimensions sont correctes
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: fill ? '100%' : (width ? `${width}px` : 'auto'),
    height: fill ? '100%' : (height ? `${height}px` : 'auto'),
    minHeight: fill ? '200px' : undefined,
    ...style
  };

  // Ajuster l'objectFit et l'objectPosition en fonction du ratio
  const adjustedObjectFit = objectFit;
  let adjustedObjectPosition = objectPosition;
  
  if (fill && ratio !== 'auto') {
    // Pour les bannières (typiquement en mode paysage), adapter la position
    if (ratio === 'landscape' && objectFit === 'cover') {
      adjustedObjectPosition = 'center 25%';
    }
    // Pour les images en portrait dans un conteneur paysage
    else if (ratio === 'portrait' && objectFit === 'cover') {
      adjustedObjectPosition = 'center';
    }
  }

  const imageStyles: React.CSSProperties = {
    objectFit: adjustedObjectFit,
    objectPosition: adjustedObjectPosition,
    width: fill ? '100%' : undefined,
    height: fill ? '100%' : undefined,
  };
  
  return (
    <div 
      className={cn(
        'relative',
        isLoading && 'animate-pulse',
        className
      )}
      style={containerStyles}
    >
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          sizes={sizes}
          priority={priority}
          quality={quality}
          loading={loadingStrategy as 'eager' | 'lazy'}
          fetchPriority={fetchPriorityValue as 'high' | 'low' | 'auto'}
          style={imageStyles}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          placeholder={blur ? 'blur' : undefined}
          blurDataURL={blur ? BLUR_DATA_URL : undefined}
          unoptimized={false}
        />
      )}
    </div>
  );
} 