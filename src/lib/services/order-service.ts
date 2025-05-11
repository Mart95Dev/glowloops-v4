import { db, auth } from '@/lib/firebase/firebase-config';
import { collection, doc, getDocs, getDoc, query, where, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { Order } from '@/lib/types/order';
import { generateInvoicePDF, generateInvoiceFilename } from './invoice-service';

// Interface pour la compatibilité avec Firestore Timestamp
interface FirestoreStatusChange {
  status: string;
  timestamp: {
    toDate: () => Date;
  };
  note?: string;
}

/**
 * Récupère toutes les commandes d'un utilisateur spécifique
 * @param userId - L'identifiant de l'utilisateur
 * @returns Promise avec un tableau des commandes
 */
export async function getUserOrders(): Promise<Order[]> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }
  
  try {
    const ordersRef = collection(db, 'orders');
    
    // Requête simple sans orderBy tant que l'index n'est pas créé
    const q = query(
      ordersRef,
      where('userId', '==', user.uid)
      // Remarque: orderBy nécessite un index composite dans Firestore
      // Créez l'index avec ce lien : https://console.firebase.google.com/v1/r/project/glowloops-v3/firestore/indexes
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    if (querySnapshot.empty) {
      return []; // Retourne un tableau vide si aucune commande
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Conversion des Timestamp Firestore en Date
      const orderDate = data.orderDate?.toDate() || new Date();
      const expectedDeliveryDate = data.expectedDeliveryDate?.toDate() || null;
      const statusHistory = data.statusHistory?.map((status: FirestoreStatusChange) => ({
        ...status,
        timestamp: status.timestamp.toDate()
      })) || [];
      
      const order: Order = {
        id: doc.id,
        userId: data.userId,
        orderNumber: data.orderNumber || doc.id.substring(0, 8).toUpperCase(),
        status: data.status || 'pending',
        items: data.items || [],
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        shippingCost: data.shippingCost || 0,
        discount: data.discount || 0,
        total: data.total || 0,
        shippingAddress: data.shippingAddress || {},
        billingAddress: data.billingAddress || data.shippingAddress || {},
        paymentMethod: data.paymentMethod || 'card',
        orderDate,
        expectedDeliveryDate,
        trackingNumber: data.trackingNumber || null,
        statusHistory: statusHistory,
        notes: data.notes || null,
      };
      
      orders.push(order);
    });
    
    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw new Error('Impossible de récupérer les commandes');
  }
}

/**
 * Récupère une commande spécifique par son identifiant
 * @param orderId - L'identifiant de la commande
 * @returns Promise avec les détails de la commande
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }
  
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnapshot = await getDoc(orderRef);
    
    if (!orderSnapshot.exists()) {
      throw new Error('Commande introuvable');
    }
    
    const data = orderSnapshot.data();
    
    // Vérifier que la commande appartient à l'utilisateur connecté
    if (data.userId !== user.uid) {
      throw new Error('Vous n\'êtes pas autorisé à consulter cette commande');
    }
    
    // Conversion des Timestamp Firestore en Date
    const orderDate = data.orderDate?.toDate() || new Date();
    const expectedDeliveryDate = data.expectedDeliveryDate?.toDate() || null;
    const statusHistory = data.statusHistory?.map((status: FirestoreStatusChange) => ({
      ...status,
      timestamp: status.timestamp.toDate()
    })) || [];
    
    const order: Order = {
      id: orderSnapshot.id,
      userId: data.userId,
      orderNumber: data.orderNumber || orderSnapshot.id.substring(0, 8).toUpperCase(),
      status: data.status || 'pending',
      items: data.items || [],
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      shippingCost: data.shippingCost || 0,
      discount: data.discount || 0,
      total: data.total || 0,
      shippingAddress: data.shippingAddress || {},
      billingAddress: data.billingAddress || data.shippingAddress || {},
      paymentMethod: data.paymentMethod || 'card',
      orderDate,
      expectedDeliveryDate,
      trackingNumber: data.trackingNumber || null,
      statusHistory: statusHistory,
      notes: data.notes || null,
    };
    
    return order;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw error;
  }
}

// Fonction pour télécharger la facture d'une commande
export async function downloadOrderInvoice(order: Order): Promise<void> {
  try {
    // Génération du PDF
    const pdfDataUri = generateInvoicePDF(order);
    
    // Génération du nom de fichier
    const filename = generateInvoiceFilename(order);
    
    // Création d'un lien de téléchargement
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = filename;
    link.style.display = 'none';
    
    // Ajout du lien au document et déclenchement du téléchargement
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfDataUri);
    }, 100);
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error);
    throw new Error('Impossible de générer la facture');
  }
}

// Fonction pour annuler une commande
export async function cancelOrder(orderId: string): Promise<boolean> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }
  
  try {
    // Vérification que la commande existe et appartient à l'utilisateur
    const order = await getOrderById(orderId);
    
    // Vérification que la commande peut être annulée
    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new Error('Cette commande ne peut plus être annulée');
    }
    
    // Mise à jour du statut de la commande
    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      status: 'cancelled',
      statusHistory: arrayUnion({
        status: 'cancelled',
        timestamp: Timestamp.now(),
        note: 'Commande annulée par le client'
      })
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error);
    throw error;
  }
}

// Fonction pour demander un retour
export async function requestOrderReturn(orderId: string, reason: string): Promise<boolean> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }
  
  try {
    // Vérification que la commande existe et appartient à l'utilisateur
    const order = await getOrderById(orderId);
    
    // Vérification que la commande peut être retournée
    if (order.status !== 'delivered') {
      throw new Error('Seules les commandes livrées peuvent faire l\'objet d\'un retour');
    }
    
    // Mise à jour du statut de la commande
    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      status: 'returned',
      statusHistory: arrayUnion({
        status: 'returned',
        timestamp: Timestamp.now(),
        note: `Retour demandé par le client. Raison: ${reason}`
      })
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la demande de retour:', error);
    throw error;
  }
} 