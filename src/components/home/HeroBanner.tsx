'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export const HeroBanner = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageUrl
}: HeroBannerProps) => {
  console.log('URL de l\'image dans HeroBanner:', imageUrl);
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-r from-[var(--lilas-clair)] to-[var(--lilas-fonce)]">
      {/* Image d'arrière-plan avec overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="GlowLoops bijoux"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--lilas-fonce)]/70"></div>
      </div>

      {/* Contenu */}
      <div className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center text-white">
        <motion.h1 
          className="mb-4 font-playfair text-3xl font-bold md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="mb-8 max-w-md text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href={ctaLink}
            className="rounded-full bg-[var(--dore)] px-8 py-3 font-medium text-white shadow-lg transition-all hover:bg-[var(--dore)]/90 hover:shadow-xl"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
