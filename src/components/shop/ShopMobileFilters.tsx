"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FilterOptions } from '@/lib/services/shop-service';
import { navigationData } from '@/lib/data/navigation-data';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { HiX } from 'react-icons/hi';
import { useState } from 'react';

interface ShopMobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export default function ShopMobileFilters({
  isOpen,
  onClose,
  filters,
  updateFilters,
  resetFilters
}: ShopMobileFiltersProps) {
  // État local pour les filtres temporaires (avant application)
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // Extraction des filtres de navigation
  const styleFilters = navigationData.find(cat => cat.name === 'Style')?.subcategories || [];
  const vibeFilters = navigationData.find(cat => cat.name === 'Vibe')?.subcategories || [];
  const materialFilters = navigationData.find(cat => cat.name === 'Matériaux')?.subcategories || [];

  // Mise à jour des filtres temporaires
  const updateTempFilters = (newFilters: Partial<FilterOptions>) => {
    setTempFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Application des filtres et fermeture du drawer
  const applyFilters = () => {
    updateFilters(tempFilters);
    onClose();
  };

  // Réinitialisation des filtres temporaires
  const handleResetFilters = () => {
    const resetFiltersObj: FilterOptions = {
      style: [],
      vibe: [],
      material: [],
      priceRange: {
        min: undefined,
        max: undefined
      },
      sortBy: 'newest',
      isNew: undefined,
      pageSize: 12
    };
    
    setTempFilters(resetFiltersObj);
    resetFilters();
  };

  // Synchronisation des filtres temporaires avec les filtres actuels lors de l'ouverture
  useState(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  });

  // Gestion des filtres de style
  const handleStyleChange = (value: string, checked: boolean) => {
    const newStyles = checked
      ? [...(tempFilters.style || []), value]
      : (tempFilters.style || []).filter(s => s !== value);
    
    updateTempFilters({ style: newStyles });
  };

  // Gestion des filtres de vibe
  const handleVibeChange = (value: string, checked: boolean) => {
    const newVibes = checked
      ? [...(tempFilters.vibe || []), value]
      : (tempFilters.vibe || []).filter(v => v !== value);
    
    updateTempFilters({ vibe: newVibes });
  };

  // Gestion des filtres de matériaux
  const handleMaterialChange = (value: string, checked: boolean) => {
    const newMaterials = checked
      ? [...(tempFilters.material || []), value]
      : (tempFilters.material || []).filter(m => m !== value);
    
    updateTempFilters({ material: newMaterials });
  };

  // Gestion du filtre de prix
  const handlePriceChange = (values: number[]) => {
    if (values.length === 2) {
      updateTempFilters({
        priceRange: {
          min: values[0],
          max: values[1]
        }
      });
    }
  };

  // Gestion du filtre de nouveauté
  const handleNewChange = (checked: boolean) => {
    updateTempFilters({ isNew: checked ? true : undefined });
  };

  // Gestion du tri
  const handleSortChange = (value: FilterOptions['sortBy']) => {
    updateTempFilters({ sortBy: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-lilas-fonce">Filtres</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label="Fermer"
                >
                  <HiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Tri */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Trier par</h3>
                  <select
                    value={tempFilters.sortBy || 'newest'}
                    onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-lilas-fonce"
                  >
                    <option value="newest">Nouveautés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="popularity">Popularité</option>
                  </select>
                </div>

                {/* Filtre Nouveautés */}
                <div>
                  <div className="flex items-center">
                    <Checkbox
                      id="mobile-new-filter"
                      checked={tempFilters.isNew === true}
                      onChange={(e) => handleNewChange(e.target.checked)}
                      className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                    />
                    <label htmlFor="mobile-new-filter" className="ml-2 text-sm text-gray-700">
                      Nouveautés uniquement
                    </label>
                  </div>
                </div>

                {/* Filtre Style */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Style</h3>
                  <div className="space-y-2">
                    {styleFilters.map((filter) => (
                      <div key={filter.href} className="flex items-center">
                        <Checkbox
                          id={`mobile-style-${filter.name}`}
                          checked={(tempFilters.style || []).includes(filter.name)}
                          onChange={(e) => handleStyleChange(filter.name, e.target.checked)}
                          className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                        />
                        <label htmlFor={`mobile-style-${filter.name}`} className="ml-2 text-sm text-gray-700">
                          {filter.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtre Vibe */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Vibe</h3>
                  <div className="space-y-2">
                    {vibeFilters.map((filter) => (
                      <div key={filter.href} className="flex items-center">
                        <Checkbox
                          id={`mobile-vibe-${filter.name}`}
                          checked={(tempFilters.vibe || []).includes(filter.name)}
                          onChange={(e) => handleVibeChange(filter.name, e.target.checked)}
                          className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                        />
                        <label htmlFor={`mobile-vibe-${filter.name}`} className="ml-2 text-sm text-gray-700">
                          {filter.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtre Matériaux */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Matériaux</h3>
                  <div className="space-y-2">
                    {materialFilters.map((filter) => (
                      <div key={filter.href} className="flex items-center">
                        <Checkbox
                          id={`mobile-material-${filter.name}`}
                          checked={(tempFilters.material || []).includes(filter.name)}
                          onChange={(e) => handleMaterialChange(filter.name, e.target.checked)}
                          className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                        />
                        <label htmlFor={`mobile-material-${filter.name}`} className="ml-2 text-sm text-gray-700">
                          {filter.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtre Prix */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Prix</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[tempFilters.priceRange?.min || 0, tempFilters.priceRange?.max || 100]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{tempFilters.priceRange?.min || 0}€</span>
                      <span>{tempFilters.priceRange?.max || 100}€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-8 flex flex-col space-y-2">
                <Button
                  onClick={applyFilters}
                  className="w-full rounded-full bg-lilas-fonce hover:bg-lilas-fonce/90 text-white"
                >
                  Appliquer les filtres
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
