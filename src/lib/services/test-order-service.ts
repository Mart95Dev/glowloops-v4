import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { OrderStatus } from '@/lib/types/order';
import { User } from 'firebase/auth';

/**
 * Ajoute une commande de test pour l'utilisateur connecté dans Firestore
 * @param user - Utilisateur Firebase connecté
 * @returns Promise avec l'ID de la commande créée
 */
export async function addTestOrderForUser(user: User): Promise<string> {
  try {
    if (!user) throw new Error('Utilisateur non connecté');
    console.log("Création d'une commande de test pour:", user.email);
    
    // Créer une commande de test
    const testOrder = {
      userId: user.uid,
      userEmail: user.email,
      items: [
        {
          productId: "prod_123",
          productName: "Bague en résine - Fleur enchantée",
          quantity: 1,
          price: 29.99,
          imageUrl: "/images/products/bague-fleur.jpg",
          variant: "Taille M",
          subtotal: 29.99
        },
        {
          productId: "prod_456",
          productName: "Collier pendentif - Étoile dorée",
          quantity: 2,
          price: 39.99,
          imageUrl: "/images/products/collier-etoile.jpg",
          variant: "Or",
          subtotal: 79.98
        }
      ],
      shippingAddress: {
        fullName: user.displayName || user.email || "Utilisateur Test",
        address1: "123 Rue des Fleurs",
        address2: "Appartement 42",
        city: "Paris",
        postalCode: "75001",
        country: "France",
        phoneNumber: "+33612345678"
      },
      billingAddress: {
        fullName: user.displayName || user.email || "Utilisateur Test",
        address1: "123 Rue des Fleurs",
        address2: "Appartement 42",
        city: "Paris",
        postalCode: "75001",
        country: "France",
        phoneNumber: "+33612345678"
      },
      orderDate: Timestamp.fromDate(new Date()),
      status: "processing" as OrderStatus,
      subtotal: 109.97,
      shippingCost: 4.99,
      tax: 23.09,
      discount: 10.00,
      total: 128.05,
      paymentMethod: {
        type: "card",
        details: "Visa se terminant par 4242",
        status: "completed",
        transactionId: "txn_" + Math.random().toString(36).substring(2, 15)
      },
      trackingNumber: "GLTRACK" + Math.floor(10000 + Math.random() * 90000),
      notes: "Commande test générée automatiquement",
      lastUpdated: Timestamp.fromDate(new Date())
    };

    // Ajouter la commande à Firestore
    const docRef = await addDoc(collection(db, "orders"), testOrder);
    console.log("Commande de test créée avec ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création de la commande de test:", error);
    throw new Error("Impossible de créer la commande de test");
  }
} 