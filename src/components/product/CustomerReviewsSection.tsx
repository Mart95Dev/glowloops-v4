"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';

interface CustomerReviewsSectionProps {
  product: Product;
}

export default function CustomerReviewsSection({ product }: CustomerReviewsSectionProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Récupérer les photos des clients
  const customerPhotos = product.media?.customerPhotos 
    ? Object.entries(product.media.customerPhotos).map(([key, data]) => ({
        id: `customer_${key}`,
        url: data.url,
        customerName: data.customerName,
        rating: data.rating
      }))
    : [];

  // Simuler des avis clients
  const mockReviews = [
    {
      id: 'review_1',
      customerName: 'Marie L.',
      rating: 5,
      date: 'Il y a 2 semaines',
      content: 'Superbe qualité, je suis ravie de mon achat ! Les boucles sont exactement comme sur les photos, très élégantes et légères à porter.',
      photoUrl: customerPhotos[0]?.url
    },
    {
      id: 'review_2',
      customerName: 'Sophie D.',
      rating: 4,
      date: 'Il y a 1 mois',
      content: 'Très satisfaite de mon achat. Le produit est conforme à la description et la livraison a été rapide. Je recommande !',
      photoUrl: customerPhotos[1]?.url
    },
    {
      id: 'review_3',
      customerName: 'Lucie F.',
      rating: 5,
      date: 'Il y a 2 mois',
      content: 'J&apos;adore ces boucles d&apos;oreilles ! Elles sont parfaites pour toutes les occasions et j&apos;ai reçu beaucoup de compliments. La qualité est au rendez-vous.',
      photoUrl: customerPhotos[2]?.url
    },
    {
      id: 'review_4',
      customerName: 'Emma B.',
      rating: 5,
      date: 'Il y a 3 mois',
      content: 'Magnifiques boucles d&apos;oreilles, très bien réalisées. L&apos;envoi était soigné et la livraison rapide. Je suis très contente de mon achat !',
      photoUrl: null
    }
  ];

  // Afficher seulement les 2 premiers avis si showAllReviews est false
  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 2);

  if (mockReviews.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Avis de nos clientes
      </h2>
      
      <div className="space-y-6 mb-6">
        {displayedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="border-b pb-6 last:border-b-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Photo du client (si disponible) */}
              {review.photoUrl && (
                <div className="md:w-1/4">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={review.photoUrl}
                      alt={`Photo de ${review.customerName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
              )}
              
              {/* Contenu de l'avis */}
              <div className={review.photoUrl ? "md:w-3/4" : "w-full"}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{review.customerName}</div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  {review.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Bouton "Voir plus d'avis" */}
      {mockReviews.length > 2 && !showAllReviews && (
        <div className="text-center">
          <Button
            variant="outline"
            className="rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10"
            onClick={() => setShowAllReviews(true)}
          >
            Voir plus d'avis
          </Button>
        </div>
      )}
      
      {/* Formulaire d'avis */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Avez-vous acheté ce produit ?
        </h3>
        <p className="text-gray-600 mb-4">
          Partagez votre expérience et aidez d&apos;autres clients à faire leur choix.
        </p>
        <Button
          className="rounded-full bg-lilas-fonce hover:bg-lilas-fonce/90 text-white"
        >
          Laisser un avis
        </Button>
      </div>
    </div>
  );
}
