"use client";

import { Button } from '@/components/ui/Button';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useState, useEffect } from 'react';

interface ModernHeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

// URL de l'image par défaut si l'URL originale n'est pas valide
const FALLBACK_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/glowloops-v3.appspot.com/o/banners%2Fdefault-hero.jpg?alt=media';

// Fonction utilitaire pour vérifier si une URL est valide
const isValidUrl = (url: string): boolean => {
  try {
    if (!url) return false;
    if (url.startsWith('/')) return true; // URL relative
    new URL(url); // Teste si l'URL est valide
    return true;
  } catch {
    return false;
  }
};

export default function ModernHeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageUrl,
}: ModernHeroBannerProps) {
  // État pour stocker l'URL de l'image vérifiée
  const [validImageUrl, setValidImageUrl] = useState<string>(FALLBACK_IMAGE);
  
  // Valider l'URL de l'image au chargement du composant
  useEffect(() => {
    setValidImageUrl(isValidUrl(imageUrl) ? imageUrl : FALLBACK_IMAGE);
  }, [imageUrl]);

  return (
    <section className="relative h-[85vh] sm:h-[90vh] md:h-[80vh] overflow-hidden bg-gradient-to-b from-lilas-clair/20 to-creme-nude/30">
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <Image
            src={validImageUrl}
            alt="Collection GlowLoops"
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            quality={90}
            fetchPriority="high"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto min-w-[375px] px-4 flex flex-col justify-center items-start">
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase bg-menthe text-white rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Nouvelle collection
          </motion.span>
          
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="rounded-full bg-dore hover:bg-dore/80 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
            >
              <Link href={ctaLink} className="flex items-center">
                {ctaText}
                <HiArrowNarrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full bg-transparent border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              <Link href="/collections">
                Voir toutes les collections
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Indicateur de défilement */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-xs mb-2">Découvrir</span>
          <motion.div 
            className="w-1 h-10 bg-white/30 rounded-full overflow-hidden"
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className="w-full h-1/2 bg-white rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
