/**
 * Données des FAQs pour la page FAQ
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'livraison' | 'produits' | 'entretien' | 'retours' | 'commande';
  order: number;
  isActive: boolean;
  isFrequent: boolean;
}

export const faqsData: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Combien de temps dure la livraison ?',
    answer: 'La livraison standard prend entre 3 et 5 jours ouvrables. Pour une livraison express, comptez 1 à 2 jours ouvrables.',
    category: 'livraison',
    order: 1,
    isActive: true,
    isFrequent: true
  },
  {
    id: 'faq-2',
    question: 'Les bijoux sont-ils hypoallergéniques ?',
    answer: 'Oui, tous nos bijoux sont fabriqués avec des matériaux hypoallergéniques. Nous utilisons principalement de l\'acier inoxydable 316L et de l\'argent 925.',
    category: 'produits',
    order: 1,
    isActive: true,
    isFrequent: true
  },
  {
    id: 'faq-3',
    question: 'Comment entretenir mes bijoux GlowLoops ?',
    answer: 'Pour préserver la beauté de vos bijoux, nous vous recommandons de les nettoyer régulièrement avec un chiffon doux. Évitez le contact avec l\'eau, les parfums et les produits cosmétiques.',
    category: 'entretien',
    order: 1,
    isActive: true,
    isFrequent: true
  },
  {
    id: 'faq-4',
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 14 jours à compter de la réception de votre commande pour retourner un produit. Le produit doit être dans son état d\'origine, non porté et dans son emballage d\'origine.',
    category: 'retours',
    order: 1,
    isActive: true,
    isFrequent: true
  },
  {
    id: 'faq-5',
    question: 'Proposez-vous des bijoux personnalisés ?',
    answer: 'Oui, nous proposons un service de personnalisation pour certains de nos bijoux. Vous pouvez ajouter une gravure, choisir la pierre ou modifier certains éléments. Contactez-nous pour plus d\'informations.',
    category: 'produits',
    order: 2,
    isActive: true,
    isFrequent: true
  },
  {
    id: 'faq-6',
    question: 'Comment suivre ma commande ?',
    answer: 'Vous recevrez un email avec un numéro de suivi dès que votre commande sera expédiée. Vous pourrez suivre votre colis directement sur le site du transporteur.',
    category: 'commande',
    order: 1,
    isActive: true,
    isFrequent: false
  },
  {
    id: 'faq-7',
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal et Apple Pay.',
    category: 'commande',
    order: 2,
    isActive: true,
    isFrequent: false
  },
  {
    id: 'faq-8',
    question: 'Livrez-vous à l\'international ?',
    answer: 'Oui, nous livrons dans toute l\'Europe. Les délais de livraison varient entre 5 et 10 jours ouvrables selon le pays.',
    category: 'livraison',
    order: 2,
    isActive: true,
    isFrequent: false
  }
];
