"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getOptimizedSrc, getResponsiveSizes } from '@/lib/utils/image-helpers';

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
 * Elle supporte le chargement prioritaire et la gestion des erreurs d'image
 */
export default function ModernHeroBanner({
  title = 'Bijoux en résine époxy faits main',
  subtitle = 'Des créations uniques et personnalisables qui subliment votre style',
  ctaText = 'Découvrir',
  ctaLink = '/collections',
  imageUrl,
}: ModernHeroBannerProps) {
  const [validImageUrl, setValidImageUrl] = useState<string>(FALLBACK_IMAGE);
  
  // Valider l'URL de l'image au chargement du composant
  useEffect(() => {
    setValidImageUrl(getOptimizedSrc(imageUrl, FALLBACK_IMAGE));
  }, [imageUrl]);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] md:h-[80vh] overflow-hidden bg-gradient-to-b from-lilas-clair/20 to-creme-nude/30">
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={validImageUrl}
          alt="Collection GlowLoops"
          fill
          priority
          quality={90}
          sizes={getResponsiveSizes('banner')}
          objectFit="cover"
          objectPosition="center"
          eager={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      
      <div className="relative container mx-auto h-full flex items-center px-4">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 animate-fadeIn">
            {title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fadeInUp">
            {subtitle}
          </p>
          <div className="animate-fadeInUp animation-delay-300">
            <Button asChild className="bg-menthe hover:bg-menthe/90 text-white rounded-full px-8 py-6 text-lg font-medium transition-all hover:shadow-xl">
              <Link href={ctaLink}>
                {ctaText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
