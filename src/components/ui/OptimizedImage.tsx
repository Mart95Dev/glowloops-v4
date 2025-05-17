'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/ui-helpers';

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
  fallbackSrc = '/images/default-product.png',
  eager = false,
  blur = true,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);
  
  // Générer un blurDataURL pour le placeholder
  useEffect(() => {
    if (blur) {
      // Un placeholder gris très léger
      setBlurDataUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg==');
    }
  }, [blur]);
  
  // Réinitialiser l'état quand src change
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsLoading(true);
    }
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      console.warn(`Erreur de chargement d'image : ${imgSrc}`);
      setImgSrc(fallbackSrc);
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
  
  const imageStyles = {
    objectFit,
    objectPosition,
    ...style,
  };
  
  return (
    <div className={cn(
      'relative',
      isLoading && 'animate-pulse',
      className
    )}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
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
    </div>
  );
} 