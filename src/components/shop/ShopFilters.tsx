"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FilterOptions } from '@/lib/services/shop-service';
import { navigationData } from '@/lib/data/navigation-data';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface ShopFiltersProps {
  filters: FilterOptions;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export default function ShopFilters({ filters, updateFilters, resetFilters }: ShopFiltersProps) {
  // État pour gérer les sections de filtres ouvertes/fermées
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    style: true,
    vibe: true,
    material: true,
    price: true
  });

  // Extraction des filtres de navigation
  const styleFilters = navigationData.find(cat => cat.name === 'Style')?.subcategories || [];
  const vibeFilters = navigationData.find(cat => cat.name === 'Vibe')?.subcategories || [];
  const materialFilters = navigationData.find(cat => cat.name === 'Matériaux')?.subcategories || [];

  // Gestion de l'ouverture/fermeture des sections
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Gestion des filtres de style
  const handleStyleChange = (value: string, checked: boolean) => {
    const newStyles = checked
      ? [...(filters.style || []), value]
      : (filters.style || []).filter(s => s !== value);
    
    updateFilters({ style: newStyles });
  };

  // Gestion des filtres de vibe
  const handleVibeChange = (value: string, checked: boolean) => {
    const newVibes = checked
      ? [...(filters.vibe || []), value]
      : (filters.vibe || []).filter(v => v !== value);
    
    updateFilters({ vibe: newVibes });
  };

  // Gestion des filtres de matériaux
  const handleMaterialChange = (value: string, checked: boolean) => {
    const newMaterials = checked
      ? [...(filters.material || []), value]
      : (filters.material || []).filter(m => m !== value);
    
    updateFilters({ material: newMaterials });
  };

  // Gestion du filtre de prix
  const handlePriceChange = (values: number[]) => {
    if (values.length === 2) {
      updateFilters({
        priceRange: {
          min: values[0],
          max: values[1]
        }
      });
    }
  };

  // Gestion du filtre de nouveauté
  const handleNewChange = (checked: boolean) => {
    updateFilters({ isNew: checked ? true : undefined });
  };

  // Gestion du tri
  const handleSortChange = (value: FilterOptions['sortBy']) => {
    updateFilters({ sortBy: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-lilas-fonce">Filtres</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-lilas-fonce"
        >
          Réinitialiser
        </Button>
      </div>

      {/* Tri */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Trier par</h3>
        <select
          value={filters.sortBy || 'newest'}
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
      <div className="mb-6">
        <div className="flex items-center">
          <Checkbox
            id="new-filter"
            checked={filters.isNew === true}
            onChange={(e) => handleNewChange(e.target.checked)}
            className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
          />
          <label htmlFor="new-filter" className="ml-2 text-sm text-gray-700">
            Nouveautés uniquement
          </label>
        </div>
      </div>

      {/* Filtre Style */}
      <div className="mb-6 border-t border-gray-100 pt-4">
        <button
          className="flex justify-between items-center w-full text-left mb-3"
          onClick={() => toggleSection('style')}
        >
          <h3 className="text-sm font-medium text-gray-700">Style</h3>
          {openSections.style ? (
            <HiChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <HiChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {openSections.style && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {styleFilters.map((filter) => (
              <div key={filter.href} className="flex items-center">
                <Checkbox
                  id={`style-${filter.name}`}
                  checked={(filters.style || []).includes(filter.name)}
                  onChange={(e) => handleStyleChange(filter.name, e.target.checked)}
                  className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                />
                <label htmlFor={`style-${filter.name}`} className="ml-2 text-sm text-gray-700">
                  {filter.name}
                </label>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Filtre Vibe */}
      <div className="mb-6 border-t border-gray-100 pt-4">
        <button
          className="flex justify-between items-center w-full text-left mb-3"
          onClick={() => toggleSection('vibe')}
        >
          <h3 className="text-sm font-medium text-gray-700">Vibe</h3>
          {openSections.vibe ? (
            <HiChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <HiChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {openSections.vibe && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {vibeFilters.map((filter) => (
              <div key={filter.href} className="flex items-center">
                <Checkbox
                  id={`vibe-${filter.name}`}
                  checked={(filters.vibe || []).includes(filter.name)}
                  onChange={(e) => handleVibeChange(filter.name, e.target.checked)}
                  className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                />
                <label htmlFor={`vibe-${filter.name}`} className="ml-2 text-sm text-gray-700">
                  {filter.name}
                </label>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Filtre Matériaux */}
      <div className="mb-6 border-t border-gray-100 pt-4">
        <button
          className="flex justify-between items-center w-full text-left mb-3"
          onClick={() => toggleSection('material')}
        >
          <h3 className="text-sm font-medium text-gray-700">Matériaux</h3>
          {openSections.material ? (
            <HiChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <HiChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {openSections.material && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {materialFilters.map((filter) => (
              <div key={filter.href} className="flex items-center">
                <Checkbox
                  id={`material-${filter.name}`}
                  checked={(filters.material || []).includes(filter.name)}
                  onChange={(e) => handleMaterialChange(filter.name, e.target.checked)}
                  className="border-lilas-fonce data-[state=checked]:bg-lilas-fonce data-[state=checked]:text-white"
                />
                <label htmlFor={`material-${filter.name}`} className="ml-2 text-sm text-gray-700">
                  {filter.name}
                </label>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Filtre Prix */}
      <div className="mb-6 border-t border-gray-100 pt-4">
        <button
          className="flex justify-between items-center w-full text-left mb-3"
          onClick={() => toggleSection('price')}
        >
          <h3 className="text-sm font-medium text-gray-700">Prix</h3>
          {openSections.price ? (
            <HiChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <HiChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {openSections.price && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-2"
          >
            <Slider
              defaultValue={[filters.priceRange?.min || 0, filters.priceRange?.max || 100]}
              min={0}
              max={100}
              step={5}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.priceRange?.min || 0}€</span>
              <span>{filters.priceRange?.max || 100}€</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
