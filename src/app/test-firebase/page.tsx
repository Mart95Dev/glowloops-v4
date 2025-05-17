"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllProducts, getProductWithImages } from '@/lib/services/product-service';
import { Product } from '@/lib/types/product';
import { ProductImage } from '@/lib/types/product-image';

// Image par défaut pour les produits sans image - utiliser une image locale
const DEFAULT_IMAGE = '/images/default-product.png';

// Fonction pour vérifier si une URL est valide sans utiliser l'objet URL
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Vérification simple: commence par http:// ou https:// et ne contient pas d'espaces
  return (url.startsWith('http://') || url.startsWith('https://')) 
    && !url.includes(' ') 
    && url.includes('.');
};

interface ProductWithImages {
  product: Product | null;
  images: ProductImage[];
}

export default function TestFirebase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productWithImages, setProductWithImages] = useState<ProductWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsList = await getAllProducts();
        
        console.log('Produits récupérés:', productsList);
        setProducts(productsList);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        setError('Erreur lors de la récupération des produits: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!selectedProduct) return;
      
      try {
        setIsLoadingImages(true);
        const result = await getProductWithImages(selectedProduct);
        setProductWithImages(result);
      } catch (err) {
        console.error('Erreur lors de la récupération des images:', err);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    if (selectedProduct) {
      fetchProductImages();
    } else {
      setProductWithImages(null);
    }
  }, [selectedProduct]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Test Firebase</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h2 className="text-xl font-bold">Erreur</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-xl font-bold">Produits ({products.length})</h2>
            
            {products.length === 0 ? (
              <p className="text-gray-500">Aucun produit trouvé.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className={`rounded-lg border p-4 shadow-sm cursor-pointer transition-all ${selectedProduct === product.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <h3 className="mb-2 text-lg font-semibold">
                      {product.basic_info?.name || 'Produit sans nom'}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                    <div className="mt-2 relative h-32">
                      <Image 
                        src={isValidUrl(product.media?.mainImageUrl) ? product.media!.mainImageUrl! : DEFAULT_IMAGE} 
                        alt={product.basic_info?.name || 'Image produit'}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold">Détails du produit</h2>
            
            {!selectedProduct ? (
              <div className="rounded-lg border p-6 bg-gray-50">
                <p className="text-center text-gray-500">Sélectionnez un produit pour voir ses détails et ses images</p>
              </div>
            ) : isLoadingImages ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : productWithImages?.product ? (
              <div className="rounded-lg border p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold mb-2">{productWithImages.product.basic_info?.name}</h3>
                    <p className="text-gray-600 mb-4">{productWithImages.product.content?.short_description}</p>
                    
                    <div className="mb-4">
                      <span className="text-lg font-semibold">
                        {productWithImages.product.pricing?.regular_price} {productWithImages.product.pricing?.currency || 'EUR'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p><span className="font-medium">Catégorie:</span> {productWithImages.product.basic_info?.categoryId}</p>
                      <p><span className="font-medium">Collection:</span> {productWithImages.product.basic_info?.collection}</p>
                      <p><span className="font-medium">SKU:</span> {productWithImages.product.basic_info?.sku}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <h4 className="font-semibold mb-2">Images du produit ({productWithImages.images.length})</h4>
                    
                    {productWithImages.images.length === 0 ? (
                      <p className="text-gray-500">Aucune image trouvée dans Firebase Storage</p>
                    ) : (
                      <div>
                        {/* Image principale */}
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Image principale:</p>
                          <div className="relative w-full h-64">
                            <Image 
                              src={isValidUrl(productWithImages.images.find(img => img.type === 'main')?.url) 
                                ? productWithImages.images.find(img => img.type === 'main')!.url 
                                : DEFAULT_IMAGE} 
                              alt="Image principale"
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-contain rounded-md"
                              priority
                            />
                          </div>
                        </div>
                        
                        {/* Galerie d'images */}
                        {productWithImages.images.filter(img => img.type === 'gallery' && isValidUrl(img.url)).length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Galerie:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {productWithImages.images
                                .filter(img => img.type === 'gallery' && isValidUrl(img.url))
                                .map(image => (
                                  <div key={image.id} className="aspect-square relative">
                                    <Image 
                                      src={image.url} 
                                      alt={image.alt}
                                      fill
                                      sizes="(max-width: 768px) 33vw, 20vw"
                                      className="object-cover rounded-md"
                                    />
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-6 bg-red-50">
                <p className="text-center text-red-700">Produit non trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
