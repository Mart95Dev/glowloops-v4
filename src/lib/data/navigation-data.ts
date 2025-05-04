export interface Subcategory {
  name: string;
  href: string;
  featured?: boolean;
  type?: 'style' | 'vibe' | 'material' | 'other';
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
      { name: 'Créoles', href: '/style/creoles', featured: true, type: 'style' },
      { name: 'Mini-hoops', href: '/style/mini-hoops', type: 'style' },
      { name: 'Ear cuffs', href: '/style/ear-cuffs', featured: true, type: 'style' },
      { name: 'Pendantes', href: '/style/pendantes', type: 'style' },
      { name: 'Puces', href: '/style/puces', type: 'style' },
      { name: 'Ear Jackets', href: '/style/ear-jackets', type: 'style' },
      { name: 'Huggies', href: '/style/huggies', type: 'style' },
      { name: 'Asymétriques', href: '/style/asymetriques', type: 'style' },
      { name: 'Mix & Match', href: '/style/mix-match', type: 'style' }
    ]
  },
  {
    name: 'Vibe',
    href: '/vibe',
    subcategories: [
      { name: 'Chic', href: '/vibe/chic', featured: true, type: 'vibe' },
      { name: 'Bold', href: '/vibe/bold', type: 'vibe' },
      { name: 'Casual', href: '/vibe/casual', type: 'vibe' },
      { name: 'Bohème', href: '/vibe/boheme', type: 'vibe' },
      { name: 'Minimaliste', href: '/vibe/minimaliste', featured: true, type: 'vibe' },
      { name: 'Y2K', href: '/vibe/y2k', type: 'vibe' },
      { name: 'Old Money', href: '/vibe/old-money', type: 'vibe' },
      { name: 'Nature Inspired', href: '/vibe/nature-inspired', type: 'vibe' }
    ]
  },
  {
    name: 'Matériaux',
    href: '/materiaux',
    subcategories: [
      { name: 'Résine', href: '/materiaux/resine', featured: true, type: 'material' },
      { name: 'Acier', href: '/materiaux/acier', type: 'material' },
      { name: 'Plaqué or', href: '/materiaux/plaque-or', featured: true, type: 'material' },
      { name: 'Argent', href: '/materiaux/argent', type: 'material' },
      { name: 'Perles', href: '/materiaux/perles', type: 'material' },
      { name: 'Matériaux Durables', href: '/materiaux/durables', type: 'material' },
      { name: 'Pierres Colorées', href: '/materiaux/pierres-colorees', type: 'material' }
    ]
  },
  {
    name: 'Tendances 2025',
    href: '/tendances-2025',
    subcategories: [
      { name: 'XXL Statement', href: '/tendances-2025/xxl-statement', type: 'other' },
      { name: 'Perles Modernes', href: '/tendances-2025/perles-modernes', type: 'other' },
      { name: 'Pierres Naturelles', href: '/tendances-2025/pierres-naturelles', type: 'other' },
      { name: 'Vintage Chic', href: '/tendances-2025/vintage-chic', type: 'other' },
      { name: 'Géométrique & Sculptural', href: '/tendances-2025/geometrique', type: 'other' }
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
