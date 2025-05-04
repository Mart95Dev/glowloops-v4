import promoData from '../data/promo-data.json';

type PromoVariant = 'default' | 'success' | 'warning';

export interface PromoInfo {
  id: string;
  message: string;
  durationDays: number;
  variant: PromoVariant;
  link: string;
}

interface PromoDataItem {
  id: string;
  message: string;
  durationDays: number;
  variant: string;
  link: string;
}

interface PromoDataFile {
  promos: PromoDataItem[];
  activePromo: string;
}

/**
 * Service pour gérer les promotions
 */
export const promoService = {
  /**
   * Récupère la promotion active
   */
  getActivePromo(): PromoInfo | null {
    const { promos, activePromo } = promoData as PromoDataFile;
    
    if (!activePromo) return null;
    
    const promo = promos.find(p => p.id === activePromo);
    if (!promo) return null;
    
    // Vérifier que la variante est valide
    const validVariants: PromoVariant[] = ['default', 'success', 'warning'];
    const variant = validVariants.includes(promo.variant as PromoVariant) 
      ? (promo.variant as PromoVariant) 
      : 'default';
    
    return {
      ...promo,
      variant
    };
  },
  
  /**
   * Calcule la date de fin de la promotion
   * @param durationDays Durée de la promotion en jours
   */
  calculateEndDate(durationDays: number): Date {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
  }
};

export default promoService;
