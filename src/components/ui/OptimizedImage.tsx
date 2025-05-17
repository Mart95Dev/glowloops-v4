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
}

const DEFAULT_FALLBACK = '/images/default-product.png';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 85,
  className,
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  fallbackSrc = DEFAULT_FALLBACK,
  eager = false,
  blur = true,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  
  // Log des props pour débogage
  useEffect(() => {
    console.log(`[OptimizedImage] Props reçues:`, {
      srcProvided: !!src,
      srcValue: src ? (src.length > 100 ? `${src.substring(0, 100)}...` : src) : null,
      alt, 
      width, 
      height, 
      fill, 
      priority
    });
  }, [src, alt, width, height, fill, priority]);
  
  // Gérer correctement la source initiale
  useEffect(() => {
    if (!src || src.trim() === '') {
      console.log(`[OptimizedImage] Source vide ou nulle, utilisation du fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      return;
    }
    
    // Vérifie si c'est une URL Firebase Storage
    const isFirebaseUrl = src.includes('firebasestorage.googleapis.com') || src.includes('storage.googleapis.com');
    if (isFirebaseUrl) {
      console.log(`[OptimizedImage] URL Firebase détectée, utilisation directe`);
      // S'assurer que l'URL Firebase est correctement formatée
      const urlWithMedia = src.includes('alt=media') ? src : `${src}${src.includes('?') ? '&' : '?'}alt=media`;
      setImgSrc(urlWithMedia);
    } else {
      console.log(`[OptimizedImage] Initialisation de l'image avec la source:`, 
        src.length > 100 ? `${src.substring(0, 100)}...` : src);
      setImgSrc(src);
    }
    
    setLoadError(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);
  
  // Générer un blurDataURL pour le placeholder
  useEffect(() => {
    if (blur) {
      // Un placeholder gris très léger
      setBlurDataUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg==');
    }
  }, [blur]);

  const handleError = () => {
    console.warn(`[OptimizedImage] Erreur de chargement de l'image:`, imgSrc);
    
    if (imgSrc !== fallbackSrc) {
      console.log(`[OptimizedImage] Basculement vers l'image de fallback:`, fallbackSrc);
      setImgSrc(fallbackSrc);
      setLoadError(true);
    } else if (fallbackSrc !== DEFAULT_FALLBACK) {
      console.log(`[OptimizedImage] Échec du fallback, utilisation de l'image par défaut:`, DEFAULT_FALLBACK);
      setImgSrc(DEFAULT_FALLBACK);
    } else {
      console.error(`[OptimizedImage] Échec de toutes les sources d'images!`);
    }
  };

  const handleLoad = () => {
    console.log(`[OptimizedImage] Image chargée avec succès:`, 
      imgSrc.length > 100 ? `${imgSrc.substring(0, 100)}...` : imgSrc);
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
    minHeight: fill ? '200px' : undefined, // Hauteur minimale pour éviter les problèmes de hauteur 0
    ...style
  };

  const imageStyles: React.CSSProperties = {
    objectFit,
    objectPosition,
    // Assurez-vous que l'image occupe tout l'espace du conteneur
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
          placeholder={blur && blurDataUrl ? 'blur' : undefined}
          blurDataURL={blurDataUrl}
        />
      )}
      
      {/* Afficher un message d'erreur si toutes les images ont échoué */}
      {loadError && imgSrc === DEFAULT_FALLBACK && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Image non disponible
        </div>
      )}
    </div>
  );
} 