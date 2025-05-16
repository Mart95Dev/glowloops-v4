"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

interface CategoryFiltersProps {
  categoryType: 'style' | 'vibe' | 'material';
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupName: string, optionId: string, isChecked: boolean) => void;
  onClearFilters: () => void;
}

export default function CategoryFilters({
  categoryType,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearFilters
}: CategoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(filterGroups.map(group => group.name));

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const countSelectedFilters = () => {
    return Object.values(selectedFilters).reduce((count, filters) => count + filters.length, 0);
  };

  const getAccentColor = () => {
    switch (categoryType) {
      case 'style':
        return 'border-lilas-fonce focus:ring-lilas-fonce text-lilas-fonce';
      case 'vibe':
        return 'border-dore focus:ring-dore text-dore';
      case 'material':
        return 'border-menthe focus:ring-menthe text-menthe';
      default:
        return 'border-lilas-fonce focus:ring-lilas-fonce text-lilas-fonce';
    }
  };

  // Mobile filters drawer
  const renderMobileFilters = () => (
    <div className="lg:hidden">
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 mb-4 w-full md:w-auto"
        variant="outline"
      >
        <Filter size={16} />
        Filtrer
        {countSelectedFilters() > 0 && (
          <span className="ml-1 bg-lilas-fonce text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {countSelectedFilters()}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 h-full w-80 max-w-full bg-white z-50 overflow-y-auto shadow-lg"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Filtres</h3>
                  <button onClick={() => setIsOpen(false)} className="p-2">
                    <X size={20} />
                  </button>
                </div>

                {countSelectedFilters() > 0 && (
                  <Button
                    onClick={onClearFilters}
                    variant="ghost"
                    className="mb-4 text-sm"
                  >
                    Effacer tous les filtres
                  </Button>
                )}

                {renderFilterGroups()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop filters
  const renderDesktopFilters = () => (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filtres</h3>
          {countSelectedFilters() > 0 && (
            <Button
              onClick={onClearFilters}
              variant="ghost"
              className="text-xs"
            >
              Tout effacer
            </Button>
          )}
        </div>
        {renderFilterGroups()}
      </div>
    </div>
  );

  // Common filter groups renderer
  const renderFilterGroups = () => (
    <div className="space-y-4">
      {filterGroups.map((group) => (
        <div key={group.name} className="border-b pb-3">
          <button
            onClick={() => toggleGroup(group.name)}
            className="flex justify-between items-center w-full py-2 font-medium text-left"
          >
            {group.name}
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedGroups.includes(group.name) ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedGroups.includes(group.name) && (
            <div className="mt-2 space-y-2">
              {group.options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`${group.name}-${option.id}`}
                    type="checkbox"
                    checked={selectedFilters[group.name]?.includes(option.id) || false}
                    onChange={(e) => onFilterChange(group.name, option.id, e.target.checked)}
                    className={`h-4 w-4 rounded ${getAccentColor()}`}
                  />
                  <label
                    htmlFor={`${group.name}-${option.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {renderMobileFilters()}
      {renderDesktopFilters()}
    </>
  );
}