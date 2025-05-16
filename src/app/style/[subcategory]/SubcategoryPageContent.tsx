'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { navigationData } from '@/lib/data/navigation-data';
import { getCategoryInfo, getProductsByStyle, CategoryInfo } from '@/lib/services/category-service';
import { getFilteredProducts } from '@/lib/services/shop-service';
import { Product } from '@/lib/types/product';
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryFeatures from '@/components/category/CategoryFeatures';
import CategoryProductGrid from '@/components/category/CategoryProductGrid';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';

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
  const styleCategory = navigationData.find(category => category.name === 'Style');
  const subcategoryData = styleCategory?.subcategories?.find(
    sub => sub.href === `/style/${subcategory}`
  );
  
  // Déterminer la valeur réelle à rechercher dans Firestore
  const getCategoryIdFromSubcategory = (subcategory: string): string[] => {
    // Table de correspondance pour les cas spéciaux - retourne un tableau de valeurs possibles
    const mapping: Record<string, string[]> = {
      'creoles': ['créoles', 'creoles'],
      'ear-cuffs': ['ear-cuffs', 'ear_cuffs'],
      'mini-hoops': ['mini-hoops', 'mini_hoops'],
      'pendantes': ['pendantes', 'pendante'],
      'puces': ['puces', 'studs'],
      'ear-jackets': ['ear-jackets', 'ear_jackets'],
      'huggies': ['huggies'],
      'asymetriques': ['asymétriques', 'asymetriques'],
      'mix-match': ['mix-match', 'mix_match']
    };
    
    return mapping[subcategory] || [subcategory];
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les informations de la catégorie
        const categoryData = await getCategoryInfo('style', subcategory);
        setCategoryInfo(categoryData);
        
        // Récupérer les produits avec la valeur appropriée pour categoryId
        const categoryIds = getCategoryIdFromSubcategory(subcategory);
        console.log(`Recherche des produits pour le style: ${subcategory}, categoryIds: ${categoryIds.join(', ')}`);
        
        // Méthode 1: Utiliser getProductsByStyle
        let styleProducts = await getProductsByStyle(categoryIds[0]);
        console.log(`Méthode 1 - Nombre de produits trouvés: ${styleProducts.length}`);
        
        // Si aucun produit trouvé, essayer avec une approche plus flexible
        if (styleProducts.length === 0) {
          console.log("Aucun produit trouvé avec la première méthode, essai méthode alternative...");
          
          // Méthode 2: Utiliser getFilteredProducts (comme dans shop-service)
          const { products } = await getFilteredProducts({
            style: categoryIds
          });
          
          // Convertir les ProductDisplay en objets Product compatible avec CategoryProductGrid
          const mappedProducts: Product[] = products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice,
            images: p.images,
            categories: p.categories,
            styles: p.styles,
            vibes: p.vibes,
            materials: p.materials,
            isNew: p.isNew,
            discount: p.discount,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
          }));
          
          console.log(`Méthode 2 - Nombre de produits trouvés: ${mappedProducts.length}`);
          
          // Si toujours aucun produit, essayer avec une recherche directe (méthode 3)
          if (mappedProducts.length === 0) {
            console.log("Essai méthode 3: recherche directe dans tous les produits...");
            
            // Récupérer tous les produits actifs
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            
            console.log(`Nombre total de produits actifs: ${querySnapshot.size}`);
            
            // Filtrer manuellement pour trouver les produits de cette catégorie
            const filteredProducts: Product[] = [];
            
            querySnapshot.forEach(doc => {
              const data = doc.data();
              let isMatchingProduct = false;
              
              // 1. Vérifier dans basic_info.categoryId
              if (data.basic_info?.categoryId && categoryIds.includes(data.basic_info.categoryId)) {
                isMatchingProduct = true;
              }
              
              // 2. Vérifier le categoryId directement (s'il existe à la racine)
              if (!isMatchingProduct && data.categoryId && categoryIds.includes(data.categoryId)) {
                isMatchingProduct = true;
              }
              
              // 3. Vérifier dans les tags
              if (!isMatchingProduct && Array.isArray(data.basic_info?.tags)) {
                const tags = data.basic_info.tags;
                for (const tag of tags) {
                  if (typeof tag === 'string' && categoryIds.includes(tag.toLowerCase())) {
                    isMatchingProduct = true;
                    break;
                  }
                }
              }
              
              // Journaliser la structure des données pour débogage
              if (doc.id.includes("creole")) {
                console.log(`Produit ${doc.id} analysé:`, {
                  categoryId: data.categoryId,
                  basicInfoCategoryId: data.basic_info?.categoryId,
                  tags: data.basic_info?.tags,
                  isMatch: isMatchingProduct
                });
              }
              
              if (isMatchingProduct) {
                filteredProducts.push({
                  id: doc.id,
                  name: data.basic_info?.name || doc.id,
                  description: data.content?.short_description || '',
                  price: data.pricing?.regular_price || 0,
                  originalPrice: data.pricing?.sale_price || undefined,
                  images: extractProductImages(data),
                  categories: [data.basic_info?.categoryId || ''],
                  styles: Array.isArray(data.styles) ? data.styles : [],
                  vibes: Array.isArray(data.vibes) ? data.vibes : [],
                  materials: Array.isArray(data.specifications?.materials) ? data.specifications.materials : [],
                  isNew: data.isNew || false,
                  discount: data.discount || 0,
                  createdAt: new Date(data.createdAt?.seconds * 1000 || Date.now()),
                  updatedAt: new Date(data.updatedAt?.seconds * 1000 || Date.now())
                });
              }
            });
            
            // Fonction utilitaire pour extraire correctement les images
            const extractProductImages = (data: Record<string, unknown>): string[] => {
              const images: string[] = [];
              
              // Cas 1: Image principale directement dans media.mainImageUrl
              if (data.media && typeof data.media === 'object' && 'mainImageUrl' in data.media && typeof data.media.mainImageUrl === 'string') {
                images.push(data.media.mainImageUrl);
              }
              
              // Cas 2: Image principale dans media.thumbnailUrl (cas des ear_cuffs)
              if (data.media && typeof data.media === 'object' && 'thumbnailUrl' in data.media && typeof data.media.thumbnailUrl === 'string') {
                if (!images.includes(data.media.thumbnailUrl)) {
                  images.push(data.media.thumbnailUrl);
                }
              }
              
              // Cas 3: Images dans galleryImageUrls
              if (data.media && typeof data.media === 'object' && 'galleryImageUrls' in data.media && typeof data.media.galleryImageUrls === 'object') {
                Object.values(data.media.galleryImageUrls as Record<string, unknown>).forEach((url) => {
                  if (typeof url === 'string' && !images.includes(url)) {
                    images.push(url);
                  }
                });
              }
              
              return images;
            };
            
            console.log(`Méthode 3 - Nombre de produits trouvés: ${filteredProducts.length}`);
            styleProducts = filteredProducts;
          } else {
            styleProducts = mappedProducts;
          }
        }
        
        setProducts(styleProducts);
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
          <Link href="/style" className="flex items-center text-sm text-lilas-fonce hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Retour à tous les styles
          </Link>
        </div>
        
        {/* Header */}
        <CategoryHeader 
          title={subcategoryData?.name || categoryInfo.name}
          description={categoryInfo.description}
          imageUrl={categoryInfo.imageUrl}
          categoryType="style"
        />
        
        {/* Caractéristiques */}
        <CategoryFeatures 
          features={categoryInfo.features || []}
          categoryType="style"
        />
        
        {/* Produits */}
        <div className="py-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6">
            Nos {subcategoryData?.name || ''}
          </h2>
          
          <CategoryProductGrid 
            products={products}
            isLoading={isLoading}
            categoryType="style"
          />
          
          {!isLoading && products.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/shop" className="inline-block bg-lilas-fonce text-white px-6 py-3 rounded-full font-medium hover:bg-lilas-fonce/90 transition-colors">
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 