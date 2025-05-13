import { 
  collection, 
  addDoc, 
  Timestamp, 
  query, 
  where, 
  getDocs,
  setDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase-config';

// Collection Firestore pour les bons de réduction
const COUPONS_COLLECTION = 'coupons';
const USER_COUPONS_COLLECTION = 'userCoupons';

/**
 * Créer un bon de réduction de test pour un utilisateur
 */
export const initCouponsForUser = async (userId: string): Promise<void> => {
  try {
    // Vérifier si l'utilisateur a déjà des bons associés
    const userCouponsQuery = query(
      collection(db, USER_COUPONS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const userCouponsSnapshot = await getDocs(userCouponsQuery);
    
    // Si l'utilisateur a déjà des bons, ne pas en créer de nouveaux
    if (!userCouponsSnapshot.empty) {
      console.log(`L'utilisateur ${userId} a déjà des bons associés.`);
      return;
    }
    
    // Créer des bons de test
    const testCoupons = [
      {
        code: 'BIENVENUE10',
        description: 'Bienvenue chez GlowLoops',
        type: 'percentage',
        value: 10,
        minPurchase: 50,
        expiryDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 jours
        isUsed: false,
        isActive: true,
        conditions: 'Valable sur tout le site, non cumulable avec d\'autres offres',
      },
      {
        code: 'SUMMER15',
        description: 'Offre été 2024',
        type: 'percentage',
        value: 15,
        minPurchase: 75,
        expiryDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 jours
        isUsed: false,
        isActive: true,
        conditions: 'Valable sur la collection été, non cumulable',
      },
      {
        code: 'FREEDELIVERY',
        description: 'Livraison gratuite',
        type: 'fixed',
        value: 5.99,
        minPurchase: 30,
        expiryDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 14 jours
        isUsed: false,
        isActive: true,
        conditions: 'Livraison standard uniquement',
      }
    ];
    
    // Ajouter les bons dans la collection coupons
    for (const couponData of testCoupons) {
      // Générer un ID unique pour ce coupon
      const couponRef = doc(collection(db, COUPONS_COLLECTION));
      const couponId = couponRef.id;
      
      // Sauvegarder le coupon avec son ID
      await setDoc(couponRef, {
        ...couponData,
        id: couponId
      });
      
      // Lier le coupon à l'utilisateur
      await addDoc(collection(db, USER_COUPONS_COLLECTION), {
        userId,
        couponId,
        isUsed: false,
        createdAt: Timestamp.now()
      });
      
      console.log(`Bon de réduction ${couponData.code} créé pour l'utilisateur ${userId}`);
    }
  } catch (error) {
    console.error('Erreur lors de la création des bons de réduction:', error);
    throw error;
  }
};

/**
 * Ajouter un bon de réduction utilisé (pour test)
 */
export const addUsedCouponForUser = async (userId: string): Promise<void> => {
  try {
    // Créer un bon de réduction utilisé
    const usedCoupon = {
      code: 'PASTPROMO20',
      description: 'Promotion passée',
      type: 'percentage',
      value: 20,
      minPurchase: 100,
      expiryDate: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)), // déjà expiré
      isUsed: true,
      usedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
      isActive: false,
      conditions: 'Offre limitée dans le temps',
      orderIdUsed: 'ORDER-1234'
    };
    
    // Générer un ID unique pour ce coupon
    const couponRef = doc(collection(db, COUPONS_COLLECTION));
    const couponId = couponRef.id;
    
    // Sauvegarder le coupon avec son ID
    await setDoc(couponRef, {
      ...usedCoupon,
      id: couponId
    });
    
    // Lier le coupon à l'utilisateur comme utilisé
    await addDoc(collection(db, USER_COUPONS_COLLECTION), {
      userId,
      couponId,
      isUsed: true,
      usedAt: usedCoupon.usedAt,
      orderIdUsed: usedCoupon.orderIdUsed,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    });
    
    console.log(`Bon de réduction utilisé créé pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de la création du bon utilisé:', error);
    throw error;
  }
}; 