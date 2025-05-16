"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types/product';
import { HiViewGrid, HiViewList } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';

interface CategoryProductGridProps {
  products: Product[];
  isLoading?: boolean;
  categoryType: 'style' | 'vibe' | 'material';
}

export default function CategoryProductGrid({ 
  products, 
  isLoading = false,
  categoryType 
}: CategoryProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-md p-4 h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-center mb-4">
          Aucun produit ne correspond à vos critères de recherche.
        </p>
        <p className="text-gray-500 text-center">
          Essayez de modifier vos filtres ou consultez nos autres catégories.
        </p>
      </div>
    );
  }

  const getAccentColor = () => {
    switch (categoryType) {
      case 'style':
        return 'text-lilas-fonce';
      case 'vibe':
        return 'text-dore';
      case 'material':
        return 'text-menthe';
      default:
        return 'text-lilas-fonce';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className={`${getAccentColor()} font-medium`}>
          {products.length} produit{products.length > 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <HiViewGrid size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <HiViewList size={18} />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        layout
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard 
              product={product} 
              viewMode={viewMode} 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 