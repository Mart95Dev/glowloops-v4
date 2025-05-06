/**
 * Données des avantages pour la section avantages de la page d'accueil
 */

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  isActive: boolean;
}

export const advantagesData: Advantage[] = [
  {
    id: 'adv-1',
    title: 'Livraison rapide',
    description: 'Livraison en 3-5 jours ouvrables partout en France',
    iconName: 'shipping',
    order: 1,
    isActive: true
  },
  {
    id: 'adv-2',
    title: 'Qualité garantie',
    description: 'Bijoux fabriqués avec des matériaux de haute qualité',
    iconName: 'quality',
    order: 2,
    isActive: true
  },
  {
    id: 'adv-3',
    title: 'Retours gratuits',
    description: 'Retours gratuits sous 14 jours',
    iconName: 'returns',
    order: 3,
    isActive: true
  },
  {
    id: 'adv-4',
    title: 'Service client',
    description: 'Notre équipe est à votre disposition 7j/7',
    iconName: 'customer-service',
    order: 4,
    isActive: true
  }
];
