"use client";

// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamic = 'force-static';
export const dynamicParams = false;

import { Suspense, useState, useEffect } from 'react';
import { getNewArrivals, getPopularProducts } from '@/lib/services/product-service';
import { getActiveCollections } from '@/lib/services/collection-service';
import { getRecentInstagramPosts } from '@/lib/services/instagram-service';
import { getFrequentFaqs } from '@/lib/services/faq-service';
import { getActiveAdvantages } from '@/lib/services/advantages-service';
import { convertToProductDisplay } from '@/lib/services/product-service';
import { bannerService } from '@/lib/services/firestore-service';
import { AdvantageIcon } from '@/components/ui/AdvantageIcon';
import {
  ModernHeroBanner,
  ModernCollectionsGrid,
  ModernNewArrivalsSlider,
  ModernInstagramSection,
  ModernBestSellersSection,
  ModernFaqAccordion,
  ModernAdvantagesBanner,
  ModernNewsletterForm
} from '@/components/home/modern-index';
import { CartTester } from '@/components/test/CartTester';
import { ProductDisplay } from '@/lib/types/product';
// Import des interfaces pour les types
import type { Collection } from '@/lib/services/collection-service';
import type { InstagramPost } from '@/lib/services/instagram-service';
import type { FaqItem } from '@/lib/services/faq-service';
import type { Advantage } from '@/lib/services/advantages-service';
import type { Banner } from '@/lib/services/firestore-service';
// import Hero from '@/components/home/Hero';
// import Reviews from '@/components/home/Reviews';
// import {
//   ModernShowcase,
//   ModernValuePropositions,
//   ModernCollectionsDisplay,
//   ModernInstagramGallery
// } from '@/components/home/modern-index';

export default function Home() {
  // État pour stocker les données
  const [newArrivals, setNewArrivals] = useState<ProductDisplay[]>([]);
  const [collectionsData, setCollectionsData] = useState<Collection[]>([]);
  const [popularProducts, setPopularProducts] = useState<ProductDisplay[]>([]);
  const [instagramPostsData, setInstagramPostsData] = useState<InstagramPost[]>([]);
  const [faqsData, setFaqsData] = useState<FaqItem[]>([]);
  const [advantagesWithIcons, setAdvantagesWithIcons] = useState<Array<Advantage & { icon: JSX.Element }>>([]);
  const [heroBanners, setHeroBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des données
        const newArrivalsData = await getNewArrivals(8);
        const collectionsRawData = await getActiveCollections(6);
        // S'assurer que toutes les collections ont une URL d'image valide
        const filteredCollections = collectionsRawData.filter(collection => !!collection.imageUrl);
        const popularProductsData = await getPopularProducts(8);
        const instagramPosts = await getRecentInstagramPosts(6);
        const faqs = await getFrequentFaqs(5);
        const advantagesData = await getActiveAdvantages(5);
        
        // Récupération de la bannière hero depuis Firestore
        const banners = await bannerService.getActiveBanners('hero');
        
        // Conversion des produits au format d'affichage
        const convertedNewArrivals = newArrivalsData.map(convertToProductDisplay);
        const convertedPopularProducts = popularProductsData.map(convertToProductDisplay);
        
        // Préparation des avantages avec les icônes
        const advantagesIcons = advantagesData.map(advantage => ({
          id: advantage.id,
          title: advantage.title,
          description: advantage.description,
          iconName: advantage.iconName,
          order: advantage.order,
          isActive: advantage.isActive,
          icon: <AdvantageIcon iconName={advantage.iconName} className="h-8 w-8 text-lilas-fonce" />
        }));

        // Mettre à jour les états
        setNewArrivals(convertedNewArrivals);
        setCollectionsData(filteredCollections);
        setPopularProducts(convertedPopularProducts);
        setInstagramPostsData(instagramPosts);
        setFaqsData(faqs);
        setAdvantagesWithIcons(advantagesIcons);
        setHeroBanners(banners);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Afficher un indicateur de chargement si les données ne sont pas encore prêtes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-lilas-clair/30 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-lilas-clair/30 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        {/* Composant de test pour le panier */}
        <CartTester />
        
        {/* Hero Banner - Design moderne et immersif */}
        <Suspense fallback={<div className="h-[85vh] w-full bg-gray-200 animate-pulse"></div>}>
          {heroBanners.length > 0 && (
            <ModernHeroBanner 
              title={heroBanners[0].title}
              subtitle={heroBanners[0].subtitle}
              ctaText={heroBanners[0].ctaText}
              ctaLink={heroBanners[0].ctaLink}
              imageUrl={heroBanners[0].imageUrl}
            />
          )}
        </Suspense>

        {/* Nouveautés - Slider moderne avec animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernNewArrivalsSlider 
            products={newArrivals}
            title="Nos nouveautés"
          />
        </Suspense>

        {/* Collections - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernCollectionsGrid 
            collections={collectionsData}
            title="Nos collections"
          />
        </Suspense>

        {/* Produits populaires - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernBestSellersSection 
            products={popularProducts}
            title="Nos best-sellers"
            subtitle="Découvrez nos bijoux les plus appréciés par nos clientes"
          />
        </Suspense>

        {/* Instagram - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernInstagramSection 
            title="Nos clientes adorent GlowLoops"
            subtitle="Rejoignez notre communauté et partagez vos moments précieux avec nos bijoux"
            instagramPosts={instagramPostsData}
            instagramUsername="glowloops"
          />
        </Suspense>

        {/* FAQ - Accordéon moderne avec animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernFaqAccordion 
            faqs={faqsData}
            title="Questions fréquentes"
          />
        </Suspense>

        {/* Newsletter - Formulaire moderne avec validation et animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernNewsletterForm 
            title="Restez informée"
            subtitle="Inscrivez-vous à notre newsletter pour recevoir nos dernières nouveautés et offres exclusives"
            buttonText="S'inscrire"
            successMessage="Merci pour votre inscription ! Vous recevrez bientôt nos dernières nouveautés."
          />
        </Suspense>
        
        {/* Avantages - Design moderne avec icônes et animations - Placé avant le footer */}
        <Suspense fallback={<div className="h-64 w-full bg-gray-200 animate-pulse"></div>}>
          <ModernAdvantagesBanner advantages={advantagesWithIcons} />
        </Suspense>
      </main>
    </div>
  );
}
