"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { useUIStore } from '@/lib/store/ui-store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Image from 'next/image';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  image: string;
}

const SearchBar: React.FC = () => {
  const { isSearchOpen, toggleSearch, closeSearch } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fermer la recherche lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearch]);

  // Recherche dans Firestore
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Recherche par nom de produit
        const searchTermLower = searchTerm.toLowerCase();
        const productsRef = collection(db, 'products');
        
        // Recherche des produits dont le nom commence par le terme de recherche
        // Note: Firestore ne supporte pas les recherches de texte complètes, 
        // donc nous utilisons une approche simplifiée
        const nameStartsWithQuery = query(
          productsRef,
          where('nameSearch', '>=', searchTermLower),
          where('nameSearch', '<=', searchTermLower + '\uf8ff'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(nameStartsWithQuery);
        
        const searchResults: SearchResult[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          searchResults.push({
            id: doc.id,
            name: data.name,
            category: data.category,
            image: data.images[0] || '',
          });
        });
        
        setResults(searchResults);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchTerm.trim())}`);
      closeSearch();
      setSearchTerm('');
    }
  };

  const handleResultClick = (id: string) => {
    router.push(`/produits/${id}`);
    closeSearch();
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Icône de recherche pour mobile */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Rechercher"
        onClick={toggleSearch}
        className="sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </Button>

      {/* Barre de recherche - toujours visible sur desktop, conditionnelle sur mobile */}
      <div
        className={`
          absolute right-0 top-0 sm:relative
          transition-all duration-300 ease-in-out
          ${isSearchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none sm:opacity-100 sm:scale-100 sm:pointer-events-auto'}
        `}
      >
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pr-10 focus:w-72 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-lilas-fonce"
            aria-label="Rechercher"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* Résultats de recherche */}
        {searchTerm.length >= 2 && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-md shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              <ul>
                {results.map((result) => (
                  <li key={result.id} className="border-b border-gray-100 last:border-none">
                    <button
                      onClick={() => handleResultClick(result.id)}
                      className="w-full px-4 py-2 text-left hover:bg-lilas-clair flex items-center"
                    >
                      {result.image && (
                        <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={result.image}
                            alt={result.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{result.name}</div>
                        <div className="text-xs text-gray-500">{result.category}</div>
                      </div>
                    </button>
                  </li>
                ))}
                <li className="p-2 text-center">
                  <button
                    onClick={handleSearch}
                    className="text-sm text-lilas-fonce hover:underline"
                  >
                    Voir tous les résultats
                  </button>
                </li>
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
