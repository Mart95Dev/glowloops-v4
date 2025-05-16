'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { navigationData } from '@/lib/data/navigation-data';
import { getCategoryInfo, getProductsByMainCategory, getSubcategories, CategoryInfo } from '@/lib/services/category-service';
import { Product } from '@/lib/types/product';
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryFeatures from '@/components/category/CategoryFeatures';
import CategoryProductGrid from '@/components/category/CategoryProductGrid';

export default function MateriauxPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({
    name: 'Explorez nos matériaux',
    description: 'Découvrez notre sélection de bijoux.',
    imageUrl: '/images/categories/materiaux-header.jpg',
    features: []
  });
  const [subcategories, setSubcategories] = useState<CategoryInfo[]>([]);
  
  // Récupérer les données de navigation pour les liens
  const materiauxCategory = navigationData.find(category => category.name === 'Matériaux');
  const navSubcategories = materiauxCategory?.subcategories || [];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les informations de la catégorie Matériaux
        const categoryData = await getCategoryInfo('materiaux');
        setCategoryInfo(categoryData);
        
        // Récupérer les sous-catégories depuis Firestore
        const subcategoriesData = await getSubcategories('materiaux');
        setSubcategories(subcategoriesData);
        
        // Récupérer les produits
        const materiauxProducts = await getProductsByMainCategory('material', 12);
        setProducts(materiauxProducts);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="min-w-[375px] py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <CategoryHeader 
          title={categoryInfo.name}
          description={categoryInfo.description}
          imageUrl={categoryInfo.imageUrl}
          categoryType="material"
        />
        
        {/* Sous-catégories */}
        <div className="py-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6">
            Découvrez nos matériaux
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subcategories.map((subcategory) => {
              // Trouver le lien de navigation correspondant
              const navSubcategory = navSubcategories.find(nav => 
                nav.name.toLowerCase() === subcategory.name.toLowerCase() ||
                nav.href.includes(subcategory.slug || '')
              );
              
              return (
                <Link 
                  key={subcategory.slug || subcategory.name} 
                  href={navSubcategory?.href || `/materiaux/${subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <motion.div 
                    className="relative h-40 sm:h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image 
                      src={subcategory.imageUrl || `/images/placeholder-category.jpg`}
                      alt={subcategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <span className="text-white font-medium p-4">{subcategory.name}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Caractéristiques */}
        <CategoryFeatures 
          features={categoryInfo.features || []}
          categoryType="material"
        />
        
        {/* Produits */}
        <div className="py-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6">
            Nos Matériaux Populaires
          </h2>
          
          <CategoryProductGrid 
            products={products}
            isLoading={isLoading}
            categoryType="material"
          />
          
          {!isLoading && products.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/shop" className="inline-block bg-menthe text-black px-6 py-3 rounded-full font-medium hover:bg-menthe/90 transition-colors">
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 