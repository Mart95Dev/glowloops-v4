"use client";

import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ModernHeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

/**
 * Bannière principale optimisée pour le LCP
 * Composant critique pour le premier affichage
 */
export default function ModernHeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageUrl
}: ModernHeroBannerProps) {
  return (
    <div className="min-w-[375px] w-full relative overflow-hidden">
      <div className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] w-full">
        {/* Image de fond - critique pour le LCP */}
        <OptimizedImage
          src={imageUrl}
          alt={title}
          fill
          priority
          quality={85}
          critical={true}
          sizes="100vw"
          className="transition-all duration-500 hover:scale-[1.02]"
          objectFit="cover"
          objectPosition="center 30%"
          sizePreset="hero"
        />
        
        {/* Overlay semi-transparent */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      </div>

      {/* Contenu de la bannière */}
      <div className="absolute inset-0 flex flex-col justify-center z-20 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">{title}</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
          <Link 
            href={ctaLink}
            className="inline-block bg-white text-lilas-fonce py-3 px-6 rounded-full font-medium hover:bg-lilas-clair hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
} 