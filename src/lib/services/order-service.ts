import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { Order } from '@/lib/types/order';

/**
 * Récupère toutes les commandes d'un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 * @returns Promise avec un tableau des commandes
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    // Créer une requête pour récupérer les commandes de l'utilisateur
    const ordersRef = collection(db, "orders");
    const orderQuery = query(ordersRef, where("userId", "==", userId));
    
    // Exécuter la requête
    const querySnapshot = await getDocs(orderQuery);
    
    // Traiter les résultats
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convertir les dates Firestore en objets Date JavaScript
      const orderDate = data.orderDate?.toDate() || new Date();
      const lastUpdated = data.lastUpdated?.toDate() || undefined;
      
      // Créer l'objet Order avec les bonnes conversions de types
      const order: Order = {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        items: data.items || [],
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        orderDate: orderDate,
        status: data.status,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        tax: data.tax,
        discount: data.discount || 0,
        total: data.total,
        paymentMethod: data.paymentMethod,
        trackingNumber: data.trackingNumber,
        notes: data.notes,
        lastUpdated: lastUpdated
      };
      
      orders.push(order);
    });
    
    return orders;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    throw new Error("Impossible de récupérer les commandes de l'utilisateur");
  }
}

/**
 * Récupère une commande spécifique par son identifiant
 * @param orderId - L'identifiant de la commande
 * @returns Promise avec les détails de la commande
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    
    if (!orderDoc.exists()) {
      return null;
    }
    
    const data = orderDoc.data();
    
    // Convertir les dates Firestore en objets Date JavaScript
    const orderDate = data.orderDate?.toDate() || new Date();
    const lastUpdated = data.lastUpdated?.toDate() || undefined;
    
    // Créer l'objet Order avec les bonnes conversions de types
    const order: Order = {
      id: orderDoc.id,
      userId: data.userId,
      userEmail: data.userEmail,
      items: data.items || [],
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      orderDate: orderDate,
      status: data.status,
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      tax: data.tax,
      discount: data.discount || 0,
      total: data.total,
      paymentMethod: data.paymentMethod,
      trackingNumber: data.trackingNumber,
      notes: data.notes,
      lastUpdated: lastUpdated
    };
    
    return order;
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    throw new Error(`Impossible de récupérer la commande avec l'ID: ${orderId}`);
  }
} 