"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getResponsiveSizes } from '@/lib/utils/image-helpers';
import { cn } from '@/lib/utils/ui-helpers';

// Constantes
const FALLBACK_IMAGE = '/images/default-banner.png';
const isProd = process.env.NODE_ENV === 'production';

interface ModernHeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

/**
 * Bannière héro moderne avec gestion optimisée des images
 * Version corrigée qui n'utilise pas asChild pour éviter l'erreur React.Children.only
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
    // Si l'URL est fournie et semble valide, l'utiliser directement
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
      if (!isProd) {
        console.log('[ModernHeroBanner] URL d\'image valide détectée:', imageUrl);
      }
      setValidImageUrl(imageUrl);
    } else {
      if (!isProd) {
        console.log('[ModernHeroBanner] URL d\'image invalide ou manquante, utilisation du fallback');
      }
      setValidImageUrl(FALLBACK_IMAGE);
    }
  }, [imageUrl]);

  // Console log pour debugging - uniquement en développement
  useEffect(() => {
    if (!isProd) {
      console.log('[ModernHeroBanner] Propriétés reçues:', { title, subtitle, ctaText, ctaLink, imageUrl });
      console.log('[ModernHeroBanner] URL d\'image validée:', validImageUrl);
    }
  }, [title, subtitle, ctaText, ctaLink, imageUrl, validImageUrl]);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] md:h-[80vh] overflow-hidden bg-gradient-to-b from-lilas-clair/20 to-creme-nude/30">
      {/* Conteneur de l'image avec hauteur et largeur explicites */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={validImageUrl}
          alt="Collection GlowLoops"
          fill
          priority
          quality={65} // Réduire davantage la qualité pour les bannières
          sizes={getResponsiveSizes('banner')}
          objectFit="cover"
          objectPosition="center 30%" 
          eager={true}
          fallbackSrc={FALLBACK_IMAGE}
          format="avif" // Utiliser AVIF pour une meilleure compression
          ratio="landscape"
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
            {/* Version corrigée utilisant un Link direct sans Button avec asChild */}
            <Link
              href={ctaLink}
              className={cn(
                "inline-flex items-center justify-center",
                "bg-menthe hover:bg-menthe/90 text-white",
                "rounded-full px-8 py-6 text-lg font-medium",
                "transition-all hover:shadow-xl",
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