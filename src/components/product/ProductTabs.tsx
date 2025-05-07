"use client";

import { useState } from 'react';
import { Product } from '@/lib/types/product';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <Tabs 
      defaultValue="description" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="description" className="text-sm md:text-base">
          Description
        </TabsTrigger>
        <TabsTrigger value="reviews" className="text-sm md:text-base">
          Avis clients
        </TabsTrigger>
        <TabsTrigger value="shipping" className="text-sm md:text-base">
          Livraison
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="p-4 border rounded-lg">
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Description détaillée</h3>
          
          <div className="text-gray-600 space-y-4">
            {product.content?.full_description ? (
              <div dangerouslySetInnerHTML={{ __html: product.content.full_description }} />
            ) : (
              <p>Aucune description détaillée disponible pour ce produit.</p>
            )}
            
            {/* Points forts */}
            {product.content?.selling_points && Object.keys(product.content.selling_points).length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-800 mb-2">Points forts</h4>
                <ul className="list-disc list-inside space-y-1">
                  {Object.values(product.content.selling_points).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Conseils de style */}
            {product.content?.style_tips && Object.keys(product.content.style_tips).length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-800 mb-2">Conseils de style</h4>
                <ul className="list-disc list-inside space-y-1">
                  {Object.values(product.content.style_tips).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Occasions */}
            {product.content?.occasion && Object.keys(product.content.occasion).length > 0 && (
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-800 mb-2">Parfait pour</h4>
                <ul className="list-disc list-inside space-y-1">
                  {Object.values(product.content.occasion).map((occasion, index) => (
                    <li key={index}>{occasion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="p-4 border rounded-lg">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Avis clients</h3>
          
          {/* Résumé des avis */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {product.social_proof?.averageRating?.toFixed(1) || "N/A"}
              </div>
              <div className="flex justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.social_proof?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {product.social_proof?.reviewCount || 0} avis
              </div>
            </div>
            
            <div className="flex-1">
              {/* Distribution des notes */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  // Simuler une distribution des avis
                  const percentage = rating === 5 ? 70 : 
                                    rating === 4 ? 20 : 
                                    rating === 3 ? 7 : 
                                    rating === 2 ? 2 : 1;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center w-12">
                        <span className="text-sm text-gray-600">{rating}</span>
                        <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-xs text-gray-500 text-right">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Message si aucun avis */}
          {(!product.social_proof?.reviewCount || product.social_proof.reviewCount === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun avis pour le moment.</p>
              <p className="text-sm text-gray-400 mt-2">Soyez le premier à donner votre avis sur ce produit !</p>
            </div>
          )}
          
          {/* Avis simulés */}
          {(product.social_proof?.reviewCount && product.social_proof.reviewCount > 0) && (
            <div className="space-y-6">
              {/* Avis 1 */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">Marie L.</div>
                    <div className="text-xs text-gray-500">Il y a 2 semaines</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  Superbe qualité, je suis ravie de mon achat ! Les boucles sont exactement comme sur les photos, très élégantes et légères à porter.
                </p>
              </div>
              
              {/* Avis 2 */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">Sophie D.</div>
                    <div className="text-xs text-gray-500">Il y a 1 mois</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  Très satisfaite de mon achat. Le produit est conforme à la description et la livraison a été rapide. Je recommande !
                </p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="p-4 border rounded-lg">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Informations de livraison</h3>
          
          <div className="space-y-6 text-gray-600">
            {/* Délais de livraison */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-2">Délais de livraison</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    <strong>Livraison standard :</strong> 2-4 jours ouvrés
                    {product.shipping?.free_shipping && " (Gratuite)"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    <strong>Livraison express :</strong> 24-48h (+ 4,90€)
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Politique de retour */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-2">Politique de retour</h4>
              <p className="mb-2">
                Vous n'êtes pas satisfait(e) de votre achat ? Pas de problème ! Vous disposez de 14 jours à compter de la réception de votre commande pour nous retourner votre article.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Retours gratuits en France métropolitaine</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Remboursement sous 7 jours après réception du retour</span>
                </li>
              </ul>
            </div>
            
            {/* Garantie */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-2">Garantie</h4>
              <p className="mb-2">
                Tous nos produits sont garantis 12 mois contre les défauts de fabrication.
              </p>
              <p className="text-sm">
                L'extension de garantie (option) prolonge cette période à 24 mois.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
