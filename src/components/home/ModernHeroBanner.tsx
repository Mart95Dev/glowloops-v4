"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getResponsiveSizes } from '@/lib/utils/image-helpers';
import { cn } from '@/lib/utils/ui-helpers';

// Constantes
const FALLBACK_IMAGE = '/images/default-banner.png';

interface ModernHeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

/**
 * Bannière héro moderne avec gestion optimisée des images
 * Version optimisée pour de meilleures performances
 */
function ModernHeroBanner({
  title = 'Bijoux en résine époxy faits main',
  subtitle = 'Des créations uniques et personnalisables qui subliment votre style',
  ctaText = 'Découvrir',
  ctaLink = '/collections',
  imageUrl,
}: ModernHeroBannerProps) {
  const [validImageUrl, setValidImageUrl] = useState<string>(imageUrl || FALLBACK_IMAGE);
  
  // Valider l'URL de l'image au chargement du composant
  useEffect(() => {
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
      setValidImageUrl(imageUrl);
    } else {
      setValidImageUrl(FALLBACK_IMAGE);
    }
  }, [imageUrl]);

  return (
    <section className="relative h-[85vh] max-h-[800px] overflow-hidden bg-gradient-to-b from-lilas-clair/20 to-creme-nude/30">
      {/* Conteneur de l'image avec hauteur et largeur explicites */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={validImageUrl}
          alt="Collection GlowLoops"
          fill
          priority
          quality={60}
          sizes={getResponsiveSizes('banner')}
          objectFit="cover"
          objectPosition="center 30%" 
          eager={true}
          fallbackSrc={FALLBACK_IMAGE}
          format="avif"
          ratio="landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      
      <div className="relative container mx-auto h-full flex items-center px-4">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            {subtitle}
          </p>
          <div>
            <Link
              href={ctaLink}
              className={cn(
                "inline-flex items-center justify-center",
                "bg-menthe hover:bg-menthe/90 text-white",
                "rounded-full px-8 py-3 md:py-4 text-lg font-medium",
                "transition-all hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilas-clair focus-visible:ring-offset-2",
                "whitespace-nowrap"
              )}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 

// Utilisation de memo pour éviter les rendus inutiles
export default memo(ModernHeroBanner); 