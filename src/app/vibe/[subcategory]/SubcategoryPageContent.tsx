'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { navigationData } from '@/lib/data/navigation-data';
import { getCategoryInfo, getProductsByVibe, CategoryInfo } from '@/lib/services/category-service';
import { Product } from '@/lib/types/product';
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryFeatures from '@/components/category/CategoryFeatures';
import CategoryProductGrid from '@/components/category/CategoryProductGrid';

interface SubcategoryPageContentProps {
  subcategory: string;
}

export default function SubcategoryPageContent({ subcategory }: SubcategoryPageContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({
    name: '',
    description: 'Découvrez notre sélection de bijoux.',
    imageUrl: '/images/categories/default-header.jpg',
    features: []
  });
  
  // Trouver les informations de la sous-catégorie dans la navigation
  const vibeCategory = navigationData.find(category => category.name === 'Vibe');
  const subcategoryData = vibeCategory?.subcategories?.find(
    sub => sub.href === `/vibe/${subcategory}`
  );
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les informations de la catégorie
        const categoryData = await getCategoryInfo('vibe', subcategory);
        setCategoryInfo(categoryData);
        
        // Récupérer les produits
        const vibeProducts = await getProductsByVibe(subcategory);
        setProducts(vibeProducts);
      } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${subcategory}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [subcategory]);
  
  return (
    <div className="min-w-[375px] py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/vibe" className="flex items-center text-sm text-dore hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Retour à toutes les vibes
          </Link>
        </div>
        
        {/* Header */}
        <CategoryHeader 
          title={subcategoryData?.name || categoryInfo.name}
          description={categoryInfo.description}
          imageUrl={categoryInfo.imageUrl}
          categoryType="vibe"
        />
        
        {/* Caractéristiques */}
        <CategoryFeatures 
          features={categoryInfo.features || []}
          categoryType="vibe"
        />
        
        {/* Produits */}
        <div className="py-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6">
            Bijoux {subcategoryData?.name || ''}
          </h2>
          
          <CategoryProductGrid 
            products={products}
            isLoading={isLoading}
            categoryType="vibe"
          />
          
          {!isLoading && products.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/shop" className="inline-block bg-dore text-white px-6 py-3 rounded-full font-medium hover:bg-dore/90 transition-colors">
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 