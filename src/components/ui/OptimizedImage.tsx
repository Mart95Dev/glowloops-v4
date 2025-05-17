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
const isProd = process.env.NODE_ENV === 'production';

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
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  
  // Log des props seulement en développement
  useEffect(() => {
    if (!isProd) {
      console.log(`[OptimizedImage] Props reçues:`, {
        srcProvided: !!src,
        srcValue: src ? (src.length > 100 ? `${src.substring(0, 100)}...` : src) : null,
        alt, 
        width, 
        height, 
        fill, 
        priority,
        format,
        ratio
      });
    }
  }, [src, alt, width, height, fill, priority, format, ratio]);
  
  // Déterminer les dimensions optimales en fonction du ratio
  useEffect(() => {
    if (ratio !== 'auto' && fill) {
      let objectPositionValue = objectPosition;
      
      // Adapter l'objectPosition en fonction du ratio d'image
      switch (ratio) {
        case 'portrait':
          objectPositionValue = 'center';
          break;
        case 'landscape':
          objectPositionValue = 'center top';
          break;
        case 'square':
          objectPositionValue = 'center';
          break;
        default:
          break;
      }
      
      if (!isProd) {
        console.log(`[OptimizedImage] Ratio d'image ajusté: ${ratio}, objectPosition: ${objectPositionValue}`);
      }
    }
  }, [ratio, fill, objectPosition]);
  
  // Fonction pour optimiser les URLs Firebase - implémentation d'URL plus performante
  const optimizeFirebaseUrl = (url: string): string => {
    if (!url) return url;
    
    // Vérifier si c'est une URL Firebase Storage
    if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
      // S'assurer que l'URL a le paramètre alt=media
      const urlWithMedia = url.includes('alt=media') ? url : `${url}${url.includes('?') ? '&' : '?'}alt=media`;
      
      // Ajouter des paramètres pour le format et la qualité
      const optimizedUrl = new URL(urlWithMedia);
      
      // Ajouter le format si supporté
      if (format !== 'auto') {
        optimizedUrl.searchParams.set('format', format);
      }
      
      // Définir la qualité pour réduire la taille du fichier
      optimizedUrl.searchParams.set('q', quality.toString());
      
      return optimizedUrl.toString();
    }
    
    return url;
  };
  
  // Gérer la source initiale avec optimisation d'URL améliorée
  useEffect(() => {
    if (!src || src.trim() === '') {
      if (!isProd) {
        console.log(`[OptimizedImage] Source vide ou nulle, utilisation du fallback: ${fallbackSrc}`);
      }
      setImgSrc(fallbackSrc);
      return;
    }
    
    // Optimiser l'URL Firebase si applicable
    const optimizedSrc = optimizeFirebaseUrl(src);
    setImgSrc(optimizedSrc);
    setLoadError(false);
    setIsLoading(true);
  }, [src, fallbackSrc, format, quality]);
  
  // Générer un blurDataURL optimisé et léger pour le placeholder
  useEffect(() => {
    if (blur) {
      // Un placeholder gris très léger - minifié
      setBlurDataUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+');
    }
  }, [blur]);

  const handleError = () => {
    if (!isProd) {
      console.warn(`[OptimizedImage] Erreur de chargement de l'image:`, imgSrc);
    }
    
    if (imgSrc !== fallbackSrc) {
      if (!isProd) {
        console.log(`[OptimizedImage] Basculement vers l'image de fallback:`, fallbackSrc);
      }
      setImgSrc(fallbackSrc);
      setLoadError(true);
    } else if (fallbackSrc !== DEFAULT_FALLBACK) {
      if (!isProd) {
        console.log(`[OptimizedImage] Échec du fallback, utilisation de l'image par défaut:`, DEFAULT_FALLBACK);
      }
      setImgSrc(DEFAULT_FALLBACK);
    } else {
      console.error(`[OptimizedImage] Échec de toutes les sources d'images!`);
    }
  };

  const handleLoad = () => {
    if (!isProd) {
      console.log(`[OptimizedImage] Image chargée avec succès:`, 
        imgSrc.length > 100 ? `${imgSrc.substring(0, 100)}...` : imgSrc);
    }
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

  // Ajuster l'objectFit et l'objectPosition en fonction du ratio
  const adjustedObjectFit = objectFit;
  let adjustedObjectPosition = objectPosition;
  
  if (fill && ratio !== 'auto') {
    // Pour les bannières (typiquement en mode paysage), adapter la position
    if (ratio === 'landscape' && objectFit === 'cover') {
      adjustedObjectPosition = 'center 25%'; // Position légèrement plus haute pour les bannières
    }
    // Pour les images en portrait dans un conteneur paysage
    else if (ratio === 'portrait' && objectFit === 'cover') {
      adjustedObjectPosition = 'center center'; // Centrer l'image
    }
  }

  const imageStyles: React.CSSProperties = {
    objectFit: adjustedObjectFit,
    objectPosition: adjustedObjectPosition,
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
          unoptimized={false} // S'assurer que Next.js optimise l'image
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