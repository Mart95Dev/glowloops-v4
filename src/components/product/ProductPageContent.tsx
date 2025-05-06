"use client";

import { useState, useEffect } from 'react';
import { getProductWithImages } from '@/lib/services/product-service';
import { Product } from '@/lib/types/product';
import { ProductImage } from '@/lib/types/product-image';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import PerfectPairSection from './PerfectPairSection';
import CompleteSetSection from './CompleteSetSection';
import HowToWearSection from './HowToWearSection';
import CustomerReviewsSection from './CustomerReviewsSection';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

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

  return (
    <div className="min-w-[375px] py-8 px-4 bg-white">
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
        <div className="mb-12">
          <ProductTabs product={product} />
        </div>

        {/* Section "Parfait ensemble" */}
        <section className="mb-12">
          <PerfectPairSection productId={product.id} />
        </section>

        {/* Section "Ensemble complet recommandé" */}
        <section className="mb-12">
          <CompleteSetSection productId={product.id} />
        </section>

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
