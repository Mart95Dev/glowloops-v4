import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase-config';
import { Coupon } from '../types/coupon';

// Collection Firestore pour les bons de réduction
const COUPONS_COLLECTION = 'coupons';
const USER_COUPONS_COLLECTION = 'userCoupons';

/**
 * Récupérer tous les bons de réduction disponibles pour un utilisateur
 */
export const getUserCoupons = async (userId: string): Promise<Coupon[]> => {
  try {
    // Récupérer les liens entre utilisateur et coupons
    const userCouponsQuery = query(
      collection(db, USER_COUPONS_COLLECTION),
      where('userId', '==', userId),
      where('isUsed', '==', false) // Ne récupérer que les bons non utilisés
    );
    
    const userCouponsSnapshot = await getDocs(userCouponsQuery);
    const couponIds = userCouponsSnapshot.docs.map(doc => doc.data().couponId);
    
    if (couponIds.length === 0) {
      console.log(`Aucun bon de réduction actif trouvé pour l'utilisateur ${userId}`);
      return []; // Retourner un tableau vide au lieu de lancer une erreur
    }
    
    // Récupérer les détails des coupons
    const couponsQuery = query(
      collection(db, COUPONS_COLLECTION),
      where('id', 'in', couponIds),
      where('isActive', '==', true)
    );
    
    const couponsSnapshot = await getDocs(couponsQuery);
    
    return couponsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        expiryDate: (data.expiryDate as Timestamp).toDate(),
        usedAt: data.usedAt ? (data.usedAt as Timestamp).toDate() : undefined,
      } as Coupon;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des bons de réduction:', error);
    throw error;
  }
};

/**
 * Récupérer l'historique des bons utilisés par un utilisateur
 */
export const getUserUsedCoupons = async (userId: string): Promise<Coupon[]> => {
  try {
    // Récupérer les liens entre utilisateur et coupons
    const userCouponsQuery = query(
      collection(db, USER_COUPONS_COLLECTION),
      where('userId', '==', userId),
      where('isUsed', '==', true)
    );
    
    const userCouponsSnapshot = await getDocs(userCouponsQuery);
    const couponIds = userCouponsSnapshot.docs.map(doc => doc.data().couponId);
    
    if (couponIds.length === 0) {
      console.log(`Aucun bon de réduction utilisé trouvé pour l'utilisateur ${userId}`);
      return []; // Retourner un tableau vide au lieu de lancer une erreur
    }
    
    // Récupérer les détails des coupons
    const couponsQuery = query(
      collection(db, COUPONS_COLLECTION),
      where('id', 'in', couponIds)
    );
    
    const couponsSnapshot = await getDocs(couponsQuery);
    
    return couponsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        expiryDate: (data.expiryDate as Timestamp).toDate(),
        usedAt: data.usedAt ? (data.usedAt as Timestamp).toDate() : undefined,
      } as Coupon;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des bons utilisés:', error);
    throw error;
  }
};

/**
 * Vérifier si un code de bon est valide
 */
export const verifyCoupon = async (code: string, userId: string): Promise<Coupon | null> => {
  try {
    // Vérifier si le coupon existe
    const couponQuery = query(
      collection(db, COUPONS_COLLECTION),
      where('code', '==', code),
      where('isActive', '==', true)
    );
    
    const couponSnapshot = await getDocs(couponQuery);
    
    if (couponSnapshot.empty) return null;
    
    const couponDoc = couponSnapshot.docs[0];
    const couponData = couponDoc.data();
    
    // Vérifier si l'utilisateur a ce coupon
    const userCouponQuery = query(
      collection(db, USER_COUPONS_COLLECTION),
      where('userId', '==', userId),
      where('couponId', '==', couponDoc.id)
    );
    
    const userCouponSnapshot = await getDocs(userCouponQuery);
    
    if (userCouponSnapshot.empty) return null;
    
    const userCouponData = userCouponSnapshot.docs[0].data();
    
    // Vérifier si le coupon a déjà été utilisé
    if (userCouponData.isUsed) return null;
    
    // Vérifier si le coupon n'est pas expiré
    const expiryDate = (couponData.expiryDate as Timestamp).toDate();
    if (expiryDate < new Date()) return null;
    
    return {
      ...couponData,
      id: couponDoc.id,
      expiryDate,
      usedAt: couponData.usedAt ? (couponData.usedAt as Timestamp).toDate() : undefined,
    } as Coupon;
  } catch (error) {
    console.error('Erreur lors de la vérification du bon:', error);
    throw error;
  }
};

/**
 * Marquer un bon comme utilisé
 */
export const markCouponAsUsed = async (
  couponId: string,
  userId: string,
  orderId: string
): Promise<void> => {
  try {
    // Trouver le lien utilisateur-coupon
    const userCouponQuery = query(
      collection(db, USER_COUPONS_COLLECTION),
      where('userId', '==', userId),
      where('couponId', '==', couponId)
    );
    
    const userCouponSnapshot = await getDocs(userCouponQuery);
    
    if (userCouponSnapshot.empty) {
      throw new Error('Bon de réduction non trouvé pour cet utilisateur');
    }
    
    const userCouponDoc = userCouponSnapshot.docs[0];
    
    // Mettre à jour le lien utilisateur-coupon
    await updateDoc(doc(db, USER_COUPONS_COLLECTION, userCouponDoc.id), {
      isUsed: true,
      usedAt: serverTimestamp(),
      orderIdUsed: orderId
    });
    
    // Mettre à jour le coupon lui-même
    await updateDoc(doc(db, COUPONS_COLLECTION, couponId), {
      isUsed: true,
      usedAt: serverTimestamp(),
      orderIdUsed: orderId
    });
  } catch (error) {
    console.error('Erreur lors du marquage du bon comme utilisé:', error);
    throw error;
  }
}; 