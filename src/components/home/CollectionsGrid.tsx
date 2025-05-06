'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Collection {
  id: string;
  name: string;
  imageUrl?: string;
  image?: string;
  slug: string;
  description?: string;
}

interface CollectionsGridProps {
  collections: Collection[];
  title: string;
}

export const CollectionsGrid = ({ collections, title }: CollectionsGridProps) => {
  console.log('Collections reçues dans le composant:', collections);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-playfair text-2xl font-bold md:text-3xl">
          {title}
        </h2>

        <motion.div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {collections.map((collection) => (
            <motion.div 
              key={collection.id}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
              variants={itemVariants}
            >
              {/* Utiliser soit imageUrl soit image */}
              {(collection.imageUrl || collection.image) ? (
                <Image
                  src={collection.imageUrl || collection.image || ''}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <p className="text-gray-500">Image non disponible</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="mb-2 font-playfair text-xl font-semibold">{collection.name}</h3>
                <Link 
                  href={`/collections/${collection.slug}`}
                  className="inline-block rounded-full border border-white px-4 py-2 text-sm transition-colors hover:bg-white hover:text-[var(--lilas-fonce)]"
                >
                  Découvrir
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
