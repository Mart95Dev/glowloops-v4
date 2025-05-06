"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Search, Loader2, Gem, ImageIcon } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { SearchResult, getSearchSuggestions, searchCategories } from '@/lib/services/search-service';
import Image from 'next/image';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Fonction pour normaliser le texte (supprimer les accents)
const normalizeText = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

interface CategoryResult {
  id: string;
  name: string;
  url: string;
}

interface SearchBarProps {
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
  const { isSearchOpen, toggleSearch, closeSearch } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categoryResults, setCategoryResults] = useState<CategoryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour effectuer la recherche
  const performSearch = useCallback(async (term: string) => {
    console.log('[SEARCHBAR] Début recherche avec terme:', term);
    
    if (!term || term.length < 2) {
      console.log('[SEARCHBAR] Terme trop court, réinitialisation des résultats');
      setResults([]);
      setCategoryResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Normaliser le terme de recherche (supprimer les accents)
      const normalizedTerm = normalizeText(term);
      console.log('[SEARCHBAR] Terme normalisé:', normalizedTerm);
      
      // Recherche de produits
      console.log('[SEARCHBAR] Appel getSearchSuggestions...');
      const productResults = await getSearchSuggestions(normalizedTerm, 5);
      console.log('[SEARCHBAR] Résultats produits reçus:', productResults);
      setResults(productResults);
      
      // Recherche de catégories
      console.log('[SEARCHBAR] Appel searchCategories...');
      const categories = await searchCategories(normalizedTerm, 3);
      console.log('[SEARCHBAR] Résultats catégories reçus:', categories);
      setCategoryResults(categories);
    } catch (error) {
      console.error('[SEARCHBAR] Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
      console.log('[SEARCHBAR] Fin de recherche, isLoading=false');
    }
  }, []);

  // Effectuer la recherche lorsque le terme de recherche change (avec debounce)
  useEffect(() => {
    // Ne lancer la recherche que si la modale est ouverte
    if (isSearchOpen) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, performSearch, isSearchOpen]);

  // Réinitialiser l'état lorsque la modale est fermée
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm('');
      setResults([]);
      setCategoryResults([]);
    }
  }, [isSearchOpen]);

  // Gérer la navigation vers un produit
  const handleProductSelect = (url: string) => {
    // Pour l'instant, on affiche juste une alerte car la page produit n'existe pas encore
    alert(`Navigation vers: ${url}`);
    // Quand les pages produits existeront: router.push(url);
    closeSearch();
  };

  // Gérer la navigation vers une catégorie
  const handleCategorySelect = (url: string) => {
    // Pour l'instant, on affiche juste une alerte car la page catégorie n'existe pas encore
    alert(`Navigation vers la catégorie: ${url}`);
    // Quand les pages catégories existeront: router.push(url);
    closeSearch();
  };

  // Gérer la soumission du formulaire de recherche
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Pour l'instant, on affiche juste une alerte car la page de recherche n'existe pas encore
      alert(`Recherche pour: ${searchTerm.trim()}`);
      // Quand la page de recherche existera: router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      closeSearch();
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rechercher"
            onClick={toggleSearch}
            className="sm:hidden"
          >
            <Search size={24} />
          </Button>
          
          <div className="hidden sm:block">
            <Button
              variant="outline"
              className="w-64 justify-start text-sm text-muted-foreground"
              onClick={toggleSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Rechercher...</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lilas-fonce/60"
              onClick={toggleSearch}
              readOnly
            />
          </div>
        </div>
      )}

      <Dialog 
        open={isSearchOpen} 
        onOpenChange={(open) => {
          if (!open) closeSearch();
        }}
      >
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogTitle className="text-xl font-semibold mb-4">Recherche</DialogTitle>
          
          {/* Champ de recherche */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-lilas-fonce/60 text-sm ${isMobile ? 'bg-white text-gray-800 border-white' : ''}`}
              placeholder="Rechercher des produits, catégories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Contenu de recherche */}
          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            {/* Affichage du loader pendant le chargement */}
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-lilas-fonce" />
              </div>
            )}
            
            {/* Message pour terme trop court */}
            {!isLoading && searchTerm.length < 2 && (
              <p className="p-4 text-sm text-center text-muted-foreground">
                Tapez au moins 2 caractères pour rechercher
              </p>
            )}
            
            {/* Message aucun résultat */}
            {!isLoading && searchTerm.length >= 2 && categoryResults.length === 0 && results.length === 0 && (
              <p className="p-4 text-sm text-center text-muted-foreground">
                Aucun résultat trouvé pour &ldquo;{searchTerm}&rdquo;
              </p>
            )}

            {/* Affichage des catégories */}
            {categoryResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">Catégories</h3>
                <div className="space-y-2">
                  {categoryResults.map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => handleCategorySelect(category.url)}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lilas-clair/30 flex items-center justify-center text-lilas-fonce">
                        <Gem size={16} />
                      </div>
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Affichage des produits */}
            {results.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">Produits</h3>
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => handleProductSelect(result.url)}
                    >
                      {result.imageUrl ? (
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={result.imageUrl}
                            alt={result.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={18} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{result.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {result.price ? `${result.price} ${result.currency || '€'}` : 'Prix non disponible'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Bouton voir tous les résultats */}
                <div className="pt-4 pb-2 px-1">
                  <Button 
                    variant="link" 
                    className="w-full text-sm text-lilas-fonce hover:text-lilas-fonce/80"
                    onClick={handleSearch}
                  >
                    Voir tous les résultats
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
