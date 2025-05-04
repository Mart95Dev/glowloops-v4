export interface Subcategory {
  name: string;
  href: string;
  featured?: boolean;
}

export interface Category {
  name: string;
  href: string;
  subcategories?: Subcategory[];
}

export const navigationData: Category[] = [
  {
    name: 'Promos',
    href: '/promos'
  },
  {
    name: 'Nouveautés',
    href: '/nouveautes',
    // subcategories: [
    //   { name: 'Cette Semaine', href: '/nouveautes/cette-semaine' },
    //   { name: 'Ce Mois', href: '/nouveautes/ce-mois' },
    //   { name: 'Exclusivités Web', href: '/nouveautes/exclusivites' }
    // ]
  },
  {
    name: 'Style',
    href: '/style',
    subcategories: [
      { name: 'Créoles', href: '/style/creoles', featured: true },
      { name: 'Mini-hoops', href: '/style/mini-hoops' },
      { name: 'Ear cuffs', href: '/style/ear-cuffs', featured: true },
      { name: 'Pendantes', href: '/style/pendantes' },
      { name: 'Puces', href: '/style/puces' },
      { name: 'Ear Jackets', href: '/style/ear-jackets' },
      { name: 'Huggies', href: '/style/huggies' },
      { name: 'Asymétriques', href: '/style/asymetriques' },
      { name: 'Mix & Match', href: '/style/mix-match' }
    ]
  },
  {
    name: 'Vibe',
    href: '/vibe',
    subcategories: [
      { name: 'Chic', href: '/vibe/chic', featured: true },
      { name: 'Bold', href: '/vibe/bold' },
      { name: 'Casual', href: '/vibe/casual' },
      { name: 'Bohème', href: '/vibe/boheme' },
      { name: 'Minimaliste', href: '/vibe/minimaliste', featured: true },
      { name: 'Y2K', href: '/vibe/y2k' },
      { name: 'Old Money', href: '/vibe/old-money' },
      { name: 'Nature Inspired', href: '/vibe/nature-inspired' }
    ]
  },
  {
    name: 'Matériaux',
    href: '/materiaux',
    subcategories: [
      { name: 'Résine', href: '/materiaux/resine', featured: true },
      { name: 'Acier', href: '/materiaux/acier' },
      { name: 'Plaqué or', href: '/materiaux/plaque-or', featured: true },
      { name: 'Argent', href: '/materiaux/argent' },
      { name: 'Perles', href: '/materiaux/perles' },
      { name: 'Matériaux Durables', href: '/materiaux/durables' },
      { name: 'Pierres Colorées', href: '/materiaux/pierres-colorees' }
    ]
  },
  {
    name: 'Tendances 2025',
    href: '/tendances-2025',
    subcategories: [
      { name: 'XXL Statement', href: '/tendances-2025/xxl-statement' },
      { name: 'Perles Modernes', href: '/tendances-2025/perles-modernes' },
      { name: 'Pierres Naturelles', href: '/tendances-2025/pierres-naturelles' },
      { name: 'Vintage Chic', href: '/tendances-2025/vintage-chic' },
      { name: 'Géométrique & Sculptural', href: '/tendances-2025/geometrique' }
    ]
  },
  {
    name: 'Pack',
    href: '/pack'
  },
  {
    name: 'Abonnement',
    href: '/abonnement'
  },  
  {
    name: 'Boutique',
    href: '/shop'
  }
];
