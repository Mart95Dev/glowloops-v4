"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types/product';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface HowToWearSectionProps {
  product: Product;
}

export default function HowToWearSection({ product }: HowToWearSectionProps) {
  const [activeTab, setActiveTab] = useState("how-to-wear");

  // Récupérer les images "how-to-wear" du produit
  const howToWearImages = product.media?.howToWearImages 
    ? Object.entries(product.media.howToWearImages).map(([key, data]) => ({
        id: `how-to-wear_${key}`,
        url: data.url,
        caption: data.caption
      }))
    : [];

  // Récupérer les photos des clients
  const customerPhotos = product.media?.customerPhotos 
    ? Object.entries(product.media.customerPhotos).map(([key, data]) => ({
        id: `customer_${key}`,
        url: data.url,
        customerName: data.customerName,
        rating: data.rating
      }))
    : [];

  if (howToWearImages.length === 0 && customerPhotos.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Comment les porter ?
      </h2>
      
      <Tabs 
        defaultValue="how-to-wear" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="how-to-wear" className="text-sm md:text-base">
            Inspirations
          </TabsTrigger>
          <TabsTrigger value="customer-photos" className="text-sm md:text-base">
            Comme porté par nos clientes
          </TabsTrigger>
        </TabsList>
        
        {/* Onglet "Comment les porter" */}
        <TabsContent value="how-to-wear">
          {howToWearImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {howToWearImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={image.caption || "Comment porter ce produit"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700">{image.caption || "Comment porter ce produit"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune image d&apos;inspiration disponible pour ce produit.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Onglet "Comme porté par nos clientes" */}
        <TabsContent value="customer-photos">
          {customerPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {customerPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={photo.url}
                      alt={`Photo de ${photo.customerName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">{photo.customerName}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-3 h-3 ${i < photo.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune photo client disponible pour ce produit.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
