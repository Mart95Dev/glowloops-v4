/**
 * Données des bannières pour la page d'accueil
 */

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  type: 'hero' | 'promo' | 'collection';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  order: number;
}

export const bannersData: Banner[] = [
  {
    id: 'banner-hero-1',
    title: 'Des bijoux uniques pour des moments précieux',
    subtitle: 'Découvrez notre collection de bijoux artisanaux, fabriqués avec amour et passion.',
    ctaText: 'Découvrir la collection',
    ctaLink: '/collections',
    imageUrl: '/images/banners/hero/hero-banner-1.jpg',
    type: 'hero',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    isActive: true,
    order: 1
  },
  {
    id: 'banner-promo-1',
    title: 'Offre spéciale été',
    subtitle: 'Profitez de 20% de réduction sur toute la collection Été',
    ctaText: 'En profiter',
    ctaLink: '/collections/ete',
    imageUrl: '/images/banners/promo/promo-banner-1.jpg',
    type: 'promo',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    order: 1
  },
  {
    id: 'banner-collection-1',
    title: 'Collection Céleste',
    subtitle: 'Des bijoux inspirés par les étoiles et les constellations',
    ctaText: 'Découvrir',
    ctaLink: '/collections/celeste',
    imageUrl: '/images/banners/collection/collection-banner-1.jpg',
    type: 'collection',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    isActive: true,
    order: 1
  }
];
