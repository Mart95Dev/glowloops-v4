"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiViewGrid, HiViewList, HiFilter, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';

interface ShopHeaderProps {
  title: string;
  subtitle: string;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleFilters: () => void;
  totalProducts: number;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ShopHeader({
  title,
  subtitle,
  viewMode,
  setViewMode,
  toggleFilters,
  totalProducts,
  resetFilters,
  hasActiveFilters
}: ShopHeaderProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          {/* Bouton pour ouvrir les filtres sur mobile */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilters}
            className="lg:hidden flex items-center gap-2 rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10"
          >
            <HiFilter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>

          {/* Boutons de changement de vue */}
          <div className="flex border border-gray-200 rounded-full overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-lilas-clair text-lilas-fonce' : 'bg-white text-gray-600'}`}
              aria-label="Vue en grille"
            >
              <HiViewGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-lilas-clair text-lilas-fonce' : 'bg-white text-gray-600'}`}
              aria-label="Vue en liste"
            >
              <HiViewList className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Informations sur les résultats et filtres actifs */}
      <div className="flex flex-wrap items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">
          {totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-sm text-lilas-fonce hover:bg-lilas-clair/20 flex items-center gap-1"
          >
            <HiX className="h-3 w-3" />
            <span>Réinitialiser les filtres</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
