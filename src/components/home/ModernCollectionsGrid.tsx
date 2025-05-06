"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// Définition du type Collection en attendant l'import correct
interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string; // Rendu optionnel pour correspondre au service
  isActive?: boolean;
}
import { useInView } from 'react-intersection-observer';
import { HiArrowNarrowRight } from 'react-icons/hi';

interface ModernCollectionsGridProps {
  collections: Collection[];
  title: string;
}

export default function ModernCollectionsGrid({ collections, title }: ModernCollectionsGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section ref={ref} className="min-w-[375px] py-16 px-4 bg-white">
      <div className="container mx-auto ">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-4 inline-block relative">
            {title}
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-menthe rounded-full"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos collections uniques de boucles d&apos;oreilles pour tous les styles et toutes les occasions
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              className="relative overflow-hidden rounded-lg shadow-sm group h-[180px] sm:h-[250px] md:h-[300px] lg:h-[350px]"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link href={`/collections/${collection.slug}`} className="relative block h-full">
                {collection.imageUrl && (
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 font-display">{collection.name}</h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-2">{collection.description}</p>
                  
                  <div className="flex items-center text-sm font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>Découvrir</span>
                    <HiArrowNarrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
