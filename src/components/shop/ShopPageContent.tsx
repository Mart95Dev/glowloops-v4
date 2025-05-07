"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getFilteredProducts, FilterOptions } from '@/lib/services/shop-service';
import { ProductDisplay } from '@/lib/types/product';
import ShopFilters from './ShopFilters';
import ProductGrid from './ProductGrid';
import ProductList from './ProductList';
import ShopHeader from './ShopHeader';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import ShopMobileFilters from './ShopMobileFilters';

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Récupération des filtres depuis l'URL
  const styleParam = searchParams.get('style');
  const vibeParam = searchParams.get('vibe');
  const materialParam = searchParams.get('material');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortByParam = searchParams.get('sortBy');
  const isNewParam = searchParams.get('isNew');

  const [filters, setFilters] = useState<FilterOptions>({
    style: styleParam ? styleParam.split(',') : [],
    vibe: vibeParam ? vibeParam.split(',') : [],
    material: materialParam ? materialParam.split(',') : [],
    priceRange: {
      min: minPriceParam ? parseInt(minPriceParam) : undefined,
      max: maxPriceParam ? parseInt(maxPriceParam) : undefined
    },
    sortBy: (sortByParam as FilterOptions['sortBy']) || 'newest',
    isNew: isNewParam === 'true' ? true : undefined,
    pageSize: 12
  });

  // Chargement des produits
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await getFilteredProducts({
          ...filters,
          lastVisible: null // Réinitialiser la pagination lors d'un changement de filtre
        });
        setProducts(result.products);
        setLastVisible(result.lastVisible);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  // Mise à jour de l'URL avec les filtres
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.style && filters.style.length > 0) {
      params.set('style', filters.style.join(','));
    }
    
    if (filters.vibe && filters.vibe.length > 0) {
      params.set('vibe', filters.vibe.join(','));
    }
    
    if (filters.material && filters.material.length > 0) {
      params.set('material', filters.material.join(','));
    }
    
    if (filters.priceRange?.min !== undefined) {
      params.set('minPrice', filters.priceRange.min.toString());
    }
    
    if (filters.priceRange?.max !== undefined) {
      params.set('maxPrice', filters.priceRange.max.toString());
    }
    
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    
    if (filters.isNew !== undefined) {
      params.set('isNew', filters.isNew.toString());
    }
    
    const url = `/shop?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, router]);

  // Chargement de plus de produits
  const loadMore = async () => {
    if (!lastVisible) return;
    
    setIsLoading(true);
    try {
      const result = await getFilteredProducts({
        ...filters,
        lastVisible
      });
      
      setProducts([...products, ...result.products]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Erreur lors du chargement de plus de produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mise à jour des filtres
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Réinitialisation des filtres
  const resetFilters = () => {
    setFilters({
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
    });
  };

  // Gestion de l'ouverture/fermeture des filtres mobiles
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="min-w-[375px] py-20 px-4 bg-white">
      <div className="container mx-auto">
        <ShopHeader 
          title="Boutique GlowLoops" 
          subtitle="Découvrez notre collection de boucles d'oreilles fashion"
          viewMode={viewMode}
          setViewMode={setViewMode}
          toggleFilters={toggleFilters}
          totalProducts={products.length}
          resetFilters={resetFilters}
          hasActiveFilters={
            (filters.style && filters.style.length > 0) ||
            (filters.vibe && filters.vibe.length > 0) ||
            (filters.material && filters.material.length > 0) ||
            filters.priceRange?.min !== undefined ||
            filters.priceRange?.max !== undefined ||
            filters.isNew !== undefined
          }
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* Filtres pour desktop (cachés sur mobile) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ShopFilters 
              filters={filters} 
              updateFilters={updateFilters}
              resetFilters={resetFilters}
            />
          </div>

          {/* Drawer de filtres pour mobile */}
          <ShopMobileFilters
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />

          {/* Contenu principal */}
          <div className="flex-1">
            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres pour voir plus de produits.</p>
                <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <ProductGrid products={products} />
                ) : (
                  <ProductList products={products} />
                )}

                {hasMore && (
                  <div className="mt-10 text-center">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      variant="outline"
                      className="rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10"
                    >
                      {isLoading ? 'Chargement...' : 'Voir plus de produits'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
