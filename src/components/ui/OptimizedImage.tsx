'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { getOptimizedImageUrl, getImagePreloadProps, ImageOptimizationOptions } from '@/lib/utils/image-optimization';
import Head from 'next/head';

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
  ratio?: 'portrait' | 'landscape' | 'square' | 'auto';
  critical?: boolean; // Indique si l'image est critique pour le LCP
  sizePreset?: 'thumbnail' | 'small' | 'medium' | 'large' | 'banner' | 'hero';
}

const DEFAULT_FALLBACK = '/images/default-product.png';

// Constante pour le placeholder - définie en dehors du composant pour éviter les recalculs
const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+';

// Taille par défaut définie pour les images critiques et non-critiques
const DEFAULT_QUALITY_CRITICAL = 85; // Augmenté pour les images critiques pour le LCP
const DEFAULT_QUALITY_NORMAL = 75;  // Optimisé pour un meilleur équilibre qualité/performance

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality,
  className,
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  fallbackSrc = DEFAULT_FALLBACK,
  eager = false,
  blur = true,
  ratio = 'auto',
  critical = false, // Indique si l'image est critique pour le LCP
  sizePreset,
}: OptimizedImageProps) {
  // Détermine si cette image est critique (pour le LCP ou explicitement définie comme critique)
  const isCritical = critical || priority;
  
  // Déterminer la qualité en fonction de la criticité
  const imageQuality = quality || (isCritical ? DEFAULT_QUALITY_CRITICAL : DEFAULT_QUALITY_NORMAL);
  
  const [imgSrc, setImgSrc] = useState<string>('');
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Préparer les options d'optimisation
  const getOptimizationOptions = (): ImageOptimizationOptions => {
    const options: ImageOptimizationOptions = {
      quality: imageQuality,
      format: 'webp',
      fetchPriority: isCritical ? 'high' : 'auto',
    };

    // Ajouter les dimensions spécifiques si fournies
    if (width) options.width = width;
    if (height) options.height = height;
    
    // Utiliser le preset de taille si fourni
    if (sizePreset) options.sizePreset = sizePreset;
    
    return options;
  };
  
  // Initialiser la source au montage du composant
  useEffect(() => {
    if (!src || src.trim() === '') {
      const optimized = getOptimizedImageUrl(fallbackSrc, getOptimizationOptions());
      setImgSrc(optimized);
      setOptimizedSrc(optimized);
      return;
    }
    
    // Optimiser l'URL avec notre fonction utilitaire améliorée
    const optimized = getOptimizedImageUrl(src, getOptimizationOptions());
    setImgSrc(optimized);
    setOptimizedSrc(optimized);
    
  }, [src, fallbackSrc, width, height, imageQuality, sizePreset]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      const optimized = getOptimizedImageUrl(fallbackSrc, getOptimizationOptions());
      setImgSrc(optimized);
    } else if (fallbackSrc !== DEFAULT_FALLBACK) {
      setImgSrc(DEFAULT_FALLBACK);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Déterminer la valeur de loading selon les props
  const loadingStrategy = isCritical || eager ? 'eager' : 'lazy';
  
  // Utiliser fetchPriority si c'est priority
  const fetchPriorityValue = isCritical ? 'high' : 'auto';
  
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
  
  // Obtenir les attributs de préchargement pour les images critiques
  const preloadProps = isCritical ? getImagePreloadProps(optimizedSrc, true) : null;
  
  return (
    <>
      {/* Précharger l'image si elle est critique */}
      {isCritical && optimizedSrc && (
        <Head>
          <link 
            rel="preload" 
            as="image" 
            href={optimizedSrc} 
            {...(preloadProps || {})}
          />
        </Head>
      )}
      
      <div 
        className={cn(
          'relative',
          isLoading && blur ? 'animate-pulse bg-gray-100' : '',
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
            priority={isCritical}
            quality={imageQuality}
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
    </>
  );
} 