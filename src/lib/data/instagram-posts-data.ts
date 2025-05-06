/**
 * Données des posts Instagram pour la section Instagram de la page d'accueil
 */

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  caption: string;
  postedAt: Date;
  username: string;
  isActive: boolean;
  likes: number;
  tags: string[];
  productIds: string[];
}

// Fonction pour créer une date aléatoire dans les 30 derniers jours
const getRandomDate = (): Date => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  return new Date(
    thirtyDaysAgo.getTime() + 
    Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  );
};

export const instagramPostsData: InstagramPost[] = [
  {
    id: 'insta-1',
    imageUrl: '/images/instagram/post1.jpg',
    link: 'https://www.instagram.com/p/ABC101/',
    caption: 'Notre cliente @sophie_m porte le collier Céleste de notre nouvelle collection ✨ #GlowLoops #BijouxUniques',
    postedAt: getRandomDate(),
    username: 'client_1',
    isActive: true,
    likes: 243,
    tags: ['bijoux', 'collection', 'client'],
    productIds: ['prod101', 'prod201']
  },
  {
    id: 'insta-2',
    imageUrl: '/images/instagram/post2.jpg',
    link: 'https://www.instagram.com/p/ABC102/',
    caption: 'Les boucles d\'oreilles Luna portées par @julie_p ✨ Merci pour cette belle photo ! #GlowLoops #BijouxArtisanaux',
    postedAt: getRandomDate(),
    username: 'client_2',
    isActive: true,
    likes: 187,
    tags: ['bijoux', 'collection', 'client'],
    productIds: ['prod102', 'prod202']
  },
  {
    id: 'insta-3',
    imageUrl: '/images/instagram/post3.jpg',
    link: 'https://www.instagram.com/p/ABC103/',
    caption: 'Notre bracelet Étoile porté par @marie_d ✨ #GlowLoops #BijouxPersonnalisés',
    postedAt: getRandomDate(),
    username: 'client_3',
    isActive: true,
    likes: 312,
    tags: ['bijoux', 'bracelet', 'client'],
    productIds: ['prod103', 'prod203']
  },
  {
    id: 'insta-4',
    imageUrl: '/images/instagram/post4.jpg',
    link: 'https://www.instagram.com/p/ABC104/',
    caption: 'La bague Soleil de notre collection Astrale ☀️ Portée par @emma_l #GlowLoops #BaguePersonnalisée',
    postedAt: getRandomDate(),
    username: 'client_4',
    isActive: true,
    likes: 276,
    tags: ['bijoux', 'bague', 'client'],
    productIds: ['prod104', 'prod204']
  },
  {
    id: 'insta-5',
    imageUrl: '/images/instagram/post5.jpg',
    link: 'https://www.instagram.com/p/ABC105/',
    caption: 'Le collier Lune et Étoile porté par @chloe_b ✨ #GlowLoops #CollectionCéleste',
    postedAt: getRandomDate(),
    username: 'client_5',
    isActive: true,
    likes: 198,
    tags: ['bijoux', 'collier', 'client'],
    productIds: ['prod105', 'prod205']
  },
  {
    id: 'insta-6',
    imageUrl: '/images/instagram/post6.jpg',
    link: 'https://www.instagram.com/p/ABC106/',
    caption: 'Notre cliente @laura_m porte les créoles Galaxie ✨ #GlowLoops #BijouxUniques',
    postedAt: getRandomDate(),
    username: 'client_6',
    isActive: true,
    likes: 231,
    tags: ['bijoux', 'créoles', 'client'],
    productIds: ['prod106', 'prod206']
  }
];
