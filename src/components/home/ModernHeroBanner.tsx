"use client";

import React from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import Head from 'next/head';

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
  // Tailles responsives pour l'image hero
  const responsiveSizes = "100vw";
  
  return (
    <>
      {/* Préchargement direct via le head pour s'assurer que le navigateur commence le chargement avant même le rendu */}
      <Head>
        <link 
          rel="preload" 
          as="image" 
          href={imageUrl} 
          fetchPriority="high"
          type="image/avif"
        />
        {/* Précharger le script JS qui sera utilisé pour le traitement de cette section */}
        <link 
          rel="preload" 
          as="script" 
          href="/chunks/app/page.js" 
          fetchPriority="high" 
        />
      </Head>
    
      <section className="min-w-[375px] w-full relative overflow-hidden">
        <div className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] w-full">
          <OptimizedImage
            src={imageUrl}
            alt="Boucles d'oreilles tendance pour sublimer votre style"
            fill
            priority
            quality={85}
            critical={true}
            sizes={responsiveSizes}
            className="transition-all duration-500 hover:scale-[1.02]"
            objectFit="cover"
            objectPosition="center 30%"
            ratio="landscape"
            sizePreset="hero"
            format="avif"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center z-20 text-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">{title}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
            <Link 
              href={ctaLink}
              className="inline-block bg-white text-lilas-fonce py-3 px-8 rounded-full font-medium hover:bg-lilas-clair hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 