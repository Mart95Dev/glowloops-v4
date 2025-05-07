"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProductsByCategory, getProductWithImages } from '@/lib/services/product-service';
import { ProductDisplay, Product } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HiOutlineShoppingBag } from 'react-icons/hi';

interface CompleteSetSectionProps {
  productId: string;
}

export default function CompleteSetSection({ productId }: CompleteSetSectionProps) {
  const [mainProduct, setMainProduct] = useState<ProductDisplay | null>(null);
  const [bundleProducts, setBundleProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Remise appliquée pour l'ensemble complet
  const discountPercentage = 30;

  useEffect(() => {
    const loadMainProduct = async () => {
      try {
        const { product } = await getProductWithImages(productId);
        if (product) {
          setMainProduct({
            id: product.id,
            name: product.basic_info?.name || '',
            description: product.content?.short_description || '',
            price: product.pricing?.regular_price || 0,
            imageUrl: product.media?.mainImageUrl || '',
            category: product.basic_info?.categoryId || '',
            isNew: product.isNew || false,
            popularity: product.popularity || 0,
            collection: product.basic_info?.collection || '',
            galleryImages: product.media?.galleryImageUrls 
              ? Object.values(product.media.galleryImageUrls) 
              : []
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit principal:', error);
      }
    };

    const loadBundleProducts = async () => {
      setIsLoading(true);
      try {
        // Charger le produit principal d'abord
        await loadMainProduct();

        // Obtenir des produits complémentaires basés sur la même collection ou catégorie
        const mainProduct = await getProductWithImages(productId);
        const collection = mainProduct.product?.basic_info?.collection || '';
        const category = mainProduct.product?.basic_info?.categoryId || '';
        
        // Priorité à la collection, puis à la catégorie pour une meilleure pertinence
        let products: Product[] = [];
        if (collection) {
          products = await getProductsByCategory(collection, 8);
        }
        
        // Si pas assez de produits par collection, compléter avec catégorie
        if (products.length < 3 && category) {
          const categoryProducts = await getProductsByCategory(category, 8);
          products = [...products, ...categoryProducts.filter(p => p.id !== productId)];
        }
        
        // Fallback : produits populaires
        if (products.length < 3) {
          const popularProducts = await getProductsByCategory('populaire', 8);
          products = [...products, ...popularProducts.filter(p => p.id !== productId)];
        }
        
        // Filtrer le produit actuel et limiter à 2 produits supplémentaires pour l'ensemble
        const filtered = products
          .filter(product => product.id !== productId)
          .slice(0, 2);
        
        setBundleProducts(filtered.map(product => ({
          id: product.id,
          name: product.basic_info?.name || '',
          description: product.content?.short_description || '',
          price: product.pricing?.regular_price || 0,
          imageUrl: product.media?.mainImageUrl || '',
          category: product.basic_info?.categoryId || '',
          isNew: product.isNew || false,
          popularity: product.popularity || 0,
          collection: product.basic_info?.collection || '',
          galleryImages: product.media?.galleryImageUrls 
            ? Object.values(product.media.galleryImageUrls) 
            : []
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des produits de l\'ensemble:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBundleProducts();
  }, [productId]);

  // Calculer le prix total et le prix avec remise
  const calculateTotals = () => {
    if (!mainProduct) return { originalPrice: 0, discountedPrice: 0, savings: 0 };
    
    // Inclure le produit principal dans le calcul
    const allProducts = [mainProduct, ...bundleProducts];
    const totalPrice = allProducts.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);
    
    return {
      originalPrice: totalPrice,
      discountedPrice,
      savings: totalPrice - discountedPrice
    };
  };

  const { originalPrice, discountedPrice, savings } = calculateTotals();

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  const handleAddBundleToCart = () => {
    // Logique d'ajout de l'ensemble au panier
    if (!mainProduct) return;
    
    const allProducts = [mainProduct, ...bundleProducts];
    console.log('Ajout de l\'ensemble au panier:', allProducts);
    // Implémenter ici la logique d'ajout avec indication que c'est un ensemble
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
      </div>
    );
  }

  // Si pas assez de produits pour former un ensemble (produit principal + au moins 1 produit)
  if (!mainProduct || bundleProducts.length < 1) {
    return null;
  }

  // Tous les produits incluant le produit principal
  const allProducts = [mainProduct, ...bundleProducts];

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center font-display">
        Ensemble complet recommandé
        <Badge variant="outline" className="ml-2 bg-dore text-black border-dore px-4 py-1.5 text-base font-bold">
          -30%
        </Badge>
      </h2>
      
      <div className="bg-lilas-clair/10 rounded-lg overflow-hidden mb-6 shadow-sm border border-lilas-clair/20">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Images des produits */}
            <div className="flex items-center justify-center gap-2 md:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                {allProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="relative w-36 h-36 md:w-48 md:h-48 rounded-lg overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 144px, 192px"
                    />
                    {index === 0 ? (
                      <div className="absolute top-0 left-0 bg-lilas-fonce text-white text-xs px-3 py-1 font-medium">
                        Principal
                      </div>
                    ) : (
                      <div className="absolute top-0 right-0 bg-dore text-black text-xs px-3 py-1 font-medium">
                        -30%
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Informations de l'ensemble */}
            <div className="md:w-1/2">
              <h3 className="font-medium text-lg text-gray-800 mb-2">
                Collection Harmonie Complète
              </h3>
              
              <p className="text-gray-600 mb-4">
                Un ensemble harmonieux de {allProducts.length} bijoux assortis, 
                spécialement sélectionnés pour créer un look élégant et coordonné. 
                Profitez d&apos;une remise exclusive de 30% sur le lot complet !
              </p>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="font-bold text-lilas-fonce text-lg">
                  {formatPrice(discountedPrice)}
                </span>
                <Badge variant="outline" className="bg-dore text-black border-dore">
                  <span>Économisez {formatPrice(savings)}</span>
                </Badge>
              </div>
              
              <div className="text-xs text-green-600 font-medium mb-4">
                Soit {formatPrice(savings)} d&apos;économie immédiate !
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {allProducts.map((product) => (
                  <div key={product.id} className="text-sm text-gray-600 flex items-center gap-1">
                    <svg className="h-4 w-4 text-lilas-fonce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                  <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ensemble assorti
                </span>
                <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                  <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30% de réduction
                </span>
                <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                  <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Livraison gratuite
                </span>
              </div>
              
              <Button 
                className="bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2 w-full md:w-auto shadow-md transition-all duration-300 hover:shadow-lg"
                onClick={handleAddBundleToCart}
              >
                <HiOutlineShoppingBag className="h-4 w-4" />
                <span>Ajouter l&apos;ensemble au panier</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
