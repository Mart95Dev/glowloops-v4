'use client';

import { ProductDisplay } from '@/lib/types/product';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

interface BestSellersSectionProps {
  products: ProductDisplay[];
  title: string;
  subtitle: string;
}

export const BestSellersSection = ({ products, title, subtitle }: BestSellersSectionProps) => {
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
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-playfair text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-gray-600">{subtitle}</p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">Aucun produit disponible pour le moment.</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
