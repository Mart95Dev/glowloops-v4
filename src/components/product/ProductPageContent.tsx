"use client";

import { useState, useEffect } from 'react';
import { getProductWithImages, getProductsByCategory } from '@/lib/services/product-service';
import { Product, ProductDisplay } from '@/lib/types/product';
import { ProductImage } from '@/lib/types/product-image';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
// import CompleteSetSection from './CompleteSetSection';
import HowToWearSection from './HowToWearSection';
import CustomerReviewsSection from './CustomerReviewsSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProductPageContentProps {
  productId: string;
}

export default function ProductPageContent({ productId }: ProductPageContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [hasWarrantyExtension, setHasWarrantyExtension] = useState(false);
  const [stockCount, setStockCount] = useState(0);
  
  // États pour PerfectPairSection
  const [relatedProducts, setRelatedProducts] = useState<ProductDisplay[]>([]);
  const [isPerfectPairLoading, setIsPerfectPairLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  // Remise appliquée pour l'ensemble
  const discountPercentage = 20;

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const { product, images } = await getProductWithImages(productId);
        setProduct(product);
        setImages(images);
        
        // Générer un nombre aléatoire pour le stock entre 3 et 15
        setStockCount(Math.floor(Math.random() * 13) + 3);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);
  
  // Effet pour charger les produits liés (Perfect Pair)
  useEffect(() => {
    const loadRelatedProducts = async () => {
      setIsPerfectPairLoading(true);
      try {
        if (!product) return;
        
        // Récupérer des informations pertinentes du produit principal
        const collection = product.basic_info?.collection || '';
        const categoryId = product.basic_info?.categoryId || '';
        const mainCategory = categoryId.split('_')[0] || categoryId; // Obtenir la catégorie principale
        
        // Utiliser la collection, la catégorie ou la catégorie principale pour trouver des produits similaires
        // On utilisera l'option qui retourne le plus de résultats
        let products: Product[] = [];
        
        // Essayons d'abord par collection
        if (collection) {
          products = await getProductsByCategory(collection, 6);
        }
        
        // Si pas assez de résultats, essayons par catégorie principale
        if (products.length < 4 && mainCategory) {
          products = await getProductsByCategory(mainCategory, 6);
        }
        
        // En dernier recours, prenons simplement des produits populaires
        if (products.length < 4) {
          // Supposons qu'il existe une fonction pour récupérer des produits populaires
          // Sinon, utilisez une autre catégorie comme fallback
          products = await getProductsByCategory('creoles', 6);
        }
        
        // Filtrer le produit actuel
        const filtered = products
          .filter(product => product.id !== productId)
          .slice(0, 4); // Limiter à 4 produits au lieu de 3
        
        setRelatedProducts(filtered.map(product => ({
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
        console.error('Erreur lors du chargement des produits complémentaires:', error);
      } finally {
        setIsPerfectPairLoading(false);
      }
    };

    if (product && product.id) {
      loadRelatedProducts();
    }
  }, [productId, product]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const toggleWarrantyExtension = () => {
    setHasWarrantyExtension(!hasWarrantyExtension);
  };

  const handleAddToCart = () => {
    // Logique d'ajout au panier à implémenter
    console.log('Ajout au panier:', {
      product,
      quantity,
      hasWarrantyExtension
    });
  };
  
  // Fonctions pour PerfectPairSection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculer le prix total et le prix avec remise
  const calculateTotals = () => {
    const selectedProductsList = relatedProducts.filter(product => selectedProducts[product.id]);
    
    const totalPrice = selectedProductsList.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);
    
    return {
      originalPrice: totalPrice,
      discountedPrice,
      count: selectedProductsList.length
    };
  };

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 aspect-square bg-gray-200 rounded-lg"></div>
        <div className="w-full lg:w-1/2">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>
    </div>;
  }

  if (!product) {
    return <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-lilas-fonce mb-4">Produit non trouvé</h1>
      <p>Le produit que vous recherchez n&apos;existe pas ou a été supprimé.</p>
    </div>;
  }
  
  // Calculer les totaux pour PerfectPairSection
  const { originalPrice, discountedPrice, count } = calculateTotals();

  return (
    <div className="min-w-[375px] py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Fil d'Ariane */}
        <Breadcrumbs 
          className="mb-4" 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Boutique', href: '/shop' },
            { label: product.basic_info?.categoryId || '', href: `/shop?category=${product.basic_info?.categoryId}` },
            { label: product.basic_info?.name || '', isCurrent: true }
          ]}
        />

        {/* Section principale du produit */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Galerie d'images */}
          <div className="w-full lg:w-1/2">
            <ProductGallery 
              product={product} 
              images={images} 
            />
          </div>

          {/* Informations produit */}
          <div className="w-full lg:w-1/2">
            <ProductInfo 
              product={product}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              hasWarrantyExtension={hasWarrantyExtension}
              onToggleWarrantyExtension={toggleWarrantyExtension}
              onAddToCart={handleAddToCart}
              stockCount={stockCount}
            />
          </div>
        </div>

        {/* Onglets d'information produit */}
        <section className="mb-12">
          <ProductTabs product={product} />
        </section>

        {/* Section "Parfait ensemble" - Code intégré directement */}
        <section className="mb-12">
          {isPerfectPairLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-40"></div>
                ))}
              </div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center font-display">
                Parfaits ensemble 👯‍♀️
                <Badge variant="dore" className="ml-2 px-4 py-1.5 text-base font-bold">
                  -20%
                </Badge>
              </h2>
              
              <div className="bg-lilas-clair/5 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">-20% sur les produits complémentaires</span> - Ajoute le produit principal et un produit complémentaire pour profiter de la remise immédiate ! La réduction s&apos;applique au produit le moins cher.
                </p>
                <p className="text-sm text-gray-600 italic mb-2">
                  Ces articles sont spécialement sélectionnés pour s&apos;assortir parfaitement avec tes nouvelles boucles d&apos;oreilles. Crée un look complet !
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                    <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Style harmonieux
                  </span>
                  <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                    <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    20% de réduction immédiate
                  </span>
                  <span className="bg-white px-2 py-1 rounded-full text-xs flex items-center border border-lilas-clair">
                    <svg className="w-3 h-3 text-lilas-fonce mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Livraison offerte dès 35€
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {relatedProducts.map((product) => {
                  // Calculer le prix avec la remise
                  const discountedPrice = product.price * (1 - discountPercentage / 100);
                  const savingsAmount = product.price - discountedPrice;
                  
                  return (
                  <motion.div
                    key={product.id}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border-2 ${
                      selectedProducts[product.id] ? 'border-lilas-fonce' : 'border-transparent'
                    }`}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="relative aspect-square overflow-hidden group">
                      <Link href={`/produits/${product.id}`} className="relative block w-full h-full">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      </Link>
                      
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          variant="outline" 
                          className="bg-white text-lilas-fonce hover:bg-lilas-clair/10 text-xs p-1 h-auto"
                          onClick={() => window.open(`/produits/${product.id}`, '_blank')}
                        >
                          Voir
                        </Button>
                      </div>
                      
                      {product.isNew && (
                        <span className="absolute top-1 left-1 bg-menthe text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                          Nouveau
                        </span>
                      )}
                      
                      {/* Badge de remise sur chaque carte */}
                      <span className="absolute top-1 right-1 bg-dore text-black text-sm font-bold px-3 py-1 rounded-full transform scale-110">
                        -20%
                      </span>
                    </div>
                    
                    <div className="p-2 flex flex-col flex-grow">
                      <h3 className="font-medium text-sm mb-0.5 text-gray-800 truncate">{product.name}</h3>
                      <div className="flex items-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-2 h-2 ${i < Math.floor(4) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-[10px] text-gray-500 ml-0.5">(12)</span>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex flex-col mb-1.5">
                          <span className="font-normal text-xs text-gray-500 line-through">{formatPrice(product.price)}</span>
                          <span className="font-bold text-lilas-fonce text-sm">{formatPrice(discountedPrice)}</span>
                          <span className="text-xs text-green-600">
                            Économisez {formatPrice(savingsAmount)}
                          </span>
                        </div>
                        
                        <Button 
                          onClick={() => toggleProductSelection(product.id)}
                          className={`w-full rounded-full ${
                            selectedProducts[product.id]
                              ? 'bg-lilas-fonce hover:bg-lilas-fonce/90 text-white'
                              : 'bg-lilas-fonce hover:bg-lilas-fonce/90 text-white'
                          } flex items-center justify-center gap-1 text-xs h-7 px-2`}
                          size="sm"
                        >
                          {selectedProducts[product.id] ? 'Sélectionné' : 'Ajouter'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )})}
              </div>
              
              {/* Résumé de l'ensemble */}
              {count > 0 && (
                <div className="bg-lilas-clair/10 p-4 rounded-lg mb-6 shadow-sm border border-lilas-clair/20">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="font-medium text-gray-800 flex items-center">
                        {count} {count > 1 ? 'produits' : 'produit'} sélectionné{count > 1 ? 's' : ''}
                        <Badge variant="dore" className="ml-2 px-4 py-1.5 text-base font-bold">
                          -20%
                        </Badge>
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="font-bold text-lg text-lilas-fonce">
                          {formatPrice(discountedPrice)}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 font-medium mt-0.5">
                        Économisez {formatPrice(originalPrice - discountedPrice)}
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg mt-2 md:mt-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Ajouter l&apos;ensemble</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* Section "Ensemble complet recommandé" */}
        {/* <section className="mb-12">
          <CompleteSetSection productId={product.id} />
        </section> */}

        {/* Section "Comment les porter" */}
        <section className="mb-12">
          <HowToWearSection product={product} />
        </section>

        {/* Section "Avis de nos clientes" */}
        <div className="mb-12">
          <CustomerReviewsSection product={product} />
        </div>
      </div>
    </div>
  );
}
