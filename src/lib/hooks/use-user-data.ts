import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { useAuth } from '@/lib/firebase/auth';
import { FavoriteProduct } from '@/components/account/favorite-item';
import { NotificationItemProps } from '@/components/account/notification-item';
import { favoritesService } from '@/lib/services/favorites-service';
import { getUserOrders } from '@/lib/services/order-service';

interface UserData {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photoURL?: string | null;
  avatarUrl?: string | null;
  phoneNumber: string | null;
  createdAt: Date | { toDate(): Date };
  lastLogin?: Date | { toDate(): Date };
  updatedAt?: Date | { toDate(): Date };
  shippingAddresses?: Array<{
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  billingAddress?: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  favoriteProductIds?: string[];
}

interface UserStats {
  orderCount: number;
  favoriteCount: number;
  unreadNotificationCount: number;
  totalSpent: number;
}

// Type strict pour la page commandes (OrderSummary)
type OrderFront = {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: {
    id: string;
    productName: string;
    imageUrl: string;
    quantity: number;
  }[];
};

export function useUserData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderFront[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userDocId, setUserDocId] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔐 useUserData - Initialisation du hook avec user:", user);
    
    async function fetchUserDataAndOrders() {
      if (!user) {
        console.log("⚠️ useUserData - Aucun utilisateur, arrêt du chargement");
        setLoading(false);
        return;
      }

      console.log("🔄 useUserData - Début du chargement des données pour:", user.uid);
      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Recherche de l'utilisateur dans Firestore avec authUserId:", user.uid);
        console.log("🔍 Recherche avec email:", user.email);
        
        // Stratégie 1: Chercher par authUserId
        let userDoc = null;
        let userDocData = null;
        
        // Chercher l'utilisateur par son authUserId
        const usersQuery = query(
          collection(db, 'users'),
          where('authUserId', '==', user.uid)
        );
        
        console.log("🔎 Exécution de la requête pour trouver l'utilisateur par authUserId");
        let usersSnapshot = await getDocs(usersQuery);
        
        // Stratégie 2: Si non trouvé, chercher par email
        if (usersSnapshot.empty && user.email) {
          console.log("🔍 Utilisateur non trouvé par ID, recherche par email:", user.email);
          const emailQuery = query(
            collection(db, 'users'),
            where('email', '==', user.email)
          );
          
          usersSnapshot = await getDocs(emailQuery);
        }
        
        // Stratégie 3: Si encore non trouvé, essayer avec l'utilisateur de test
        if (usersSnapshot.empty) {
          console.log("⚠️ Aucun utilisateur trouvé avec authUserId ou email. Tentative avec 'user_test_1'");
          
          // Pour le développement uniquement: essayer de récupérer l'utilisateur de test
          const testUsersQuery = query(
            collection(db, 'users'),
            where('authUserId', '==', 'user_test_1')
          );
          
          usersSnapshot = await getDocs(testUsersQuery);
          
          if (usersSnapshot.empty) {
            console.log("⚠️ Tentative avec le document spécifique 'user_test_1'");
            
            // Dernière tentative: chercher directement le document par ID
            const testUserDocRef = doc(db, 'users', 'user_test_1');
            const testUserDoc = await getDoc(testUserDocRef);
            
            if (testUserDoc.exists()) {
              userDoc = testUserDoc;
              userDocData = testUserDoc.data() as UserData;
              console.log("✅ Document utilisateur de test trouvé directement:", userDocData);
            } else {
              console.error("❌ ERREUR: Aucun utilisateur trouvé, même l'utilisateur de test");
              throw new Error("Impossible de récupérer les données utilisateur. Veuillez réessayer plus tard.");
            }
          } else {
            userDoc = usersSnapshot.docs[0];
            userDocData = userDoc.data() as UserData;
            console.log("✅ Utilisateur de test trouvé par requête:", userDocData);
          }
        } else {
          userDoc = usersSnapshot.docs[0];
          userDocData = userDoc.data() as UserData;
          console.log("✅ Utilisateur trouvé dans Firestore:", userDocData);
        }
        
        console.log("📄 Structure des données:", JSON.stringify(userDocData, null, 2));
        
        // Création de l'objet userData à partir des données récupérées
        if (userDocData) {
          // Vérifier si userDocData.createdAt est un objet Firestore Timestamp et le convertir si nécessaire
          const createdAtDate = typeof userDocData.createdAt === 'object' && 'toDate' in userDocData.createdAt
            ? userDocData.createdAt.toDate()
            : new Date(userDocData.createdAt || Date.now());
            
          // Vérifier si userDocData.updatedAt est un objet Firestore Timestamp et le convertir si nécessaire
          const updatedAtDate = userDocData.updatedAt && typeof userDocData.updatedAt === 'object' && 'toDate' in userDocData.updatedAt
            ? userDocData.updatedAt.toDate()
            : userDocData.updatedAt ? new Date(userDocData.updatedAt) : undefined;
          
          const userDataFormatted = {
            displayName: `${userDocData.firstName || ''} ${userDocData.lastName || ''}`.trim() || user.displayName || 'Utilisateur',
            firstName: userDocData.firstName || user.displayName?.split(' ')[0] || '',
            lastName: userDocData.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
            email: userDocData.email || user.email || '',
            photoURL: userDocData.avatarUrl || user.photoURL,
            avatarUrl: userDocData.avatarUrl || user.photoURL,
            phoneNumber: userDocData.phoneNumber || user.phoneNumber,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
            shippingAddresses: userDocData.shippingAddresses || [],
            billingAddress: userDocData.billingAddress || null,
            favoriteProductIds: userDocData.favoriteProductIds || []
          };
          
          console.log("🧩 Données utilisateur formatées:", userDataFormatted);
          setUserData(userDataFormatted);
          
          // Quand le document utilisateur est récupéré, stocker son ID pour les mises à jour ultérieures
          setUserDocId(userDoc.id);
          
          // Récupérer les commandes avec la méthode fiable
          const orders = await getUserOrders(user.uid);
          // Mapper les commandes pour correspondre au format Order attendu par la page commandes
          const mappedOrders: OrderFront[] = orders.map((order) => {
            let status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
            switch (order.status) {
              case 'pending':
              case 'processing':
              case 'shipped':
              case 'delivered':
              case 'cancelled':
                status = order.status;
                break;
              default:
                status = 'cancelled';
            }
            return {
              id: order.id,
              orderNumber: order.id,
              date: order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate),
              status,
              totalAmount: order.total ?? 0,
              items: order.items?.map(item => ({
                id: item.productId,
                productName: item.productName,
                imageUrl: item.imageUrl ?? '',
                quantity: item.quantity
              })) ?? []
            };
          });
          setRecentOrders(mappedOrders);
          
          // Initialiser les statistiques utilisateur
          generateOrderNotifications(mappedOrders);
          
          // Récupérer les produits favoris via le service
          try {
            // Utiliser le service pour récupérer les favoris réels de l'utilisateur
            const userFavorites = await favoritesService.getUserFavorites(userDoc.id);
            console.log("❤️ Favoris récupérés pour l'utilisateur:", userFavorites);
            setFavorites(userFavorites);
            
            // Mettre à jour les stats avec le nombre réel de favoris
            setUserStats({
              orderCount: mappedOrders.length,
              favoriteCount: userFavorites.length,
              unreadNotificationCount: notifications.filter(n => !n.isRead).length,
              totalSpent: mappedOrders.reduce((total, order) => total + order.totalAmount, 0)
            });
          } catch (error) {
            console.error("❌ Erreur lors de la récupération des favoris:", error);
            // En cas d'erreur, initialiser une liste vide (pas de données fictives)
            setFavorites([]);
            
            // Mettre à jour les stats sans favoris
            setUserStats({
              orderCount: mappedOrders.length,
              favoriteCount: 0,
              unreadNotificationCount: notifications.filter(n => !n.isRead).length,
              totalSpent: mappedOrders.reduce((total, order) => total + order.totalAmount, 0)
            });
          }
        } else {
          throw new Error("Format de données utilisateur invalide");
        }
      } catch (err) {
        console.error("❌ useUserData - Erreur lors de la récupération des données:", err);
        setError((err as Error).message || "Erreur lors de la récupération des données utilisateur");
      } finally {
        setLoading(false);
      }
    }
    
    function generateOrderNotifications(orders: OrderFront[]) {
      const notifications: NotificationItemProps[] = [];
      orders.forEach(order => {
        if (order.status === 'pending') {
          notifications.push({
            id: `notif-pending-${order.id}`,
            type: 'order',
            title: 'Commande en attente',
            message: `Votre commande ${order.orderNumber} est en attente de traitement.`,
            date: order.date,
            isRead: false
          });
        }
        if (order.status === 'processing') {
          notifications.push({
            id: `notif-processing-${order.id}`,
            type: 'order',
            title: 'Commande en préparation',
            message: `Votre commande ${order.orderNumber} est en cours de préparation.`,
            date: order.date,
            isRead: false
          });
        }
        if (order.status === 'shipped') {
          notifications.push({
            id: `notif-shipped-${order.id}`,
            type: 'order',
            title: 'Commande expédiée',
            message: `Votre commande ${order.orderNumber} a été expédiée.`,
            date: order.date,
            isRead: false
          });
        }
        if (order.status === 'delivered') {
          notifications.push({
            id: `notif-delivered-${order.id}`,
            type: 'order',
            title: 'Commande livrée',
            message: `Votre commande ${order.orderNumber} a été livrée.`,
            date: order.date,
            isRead: false
          });
        }
        if (order.status === 'cancelled') {
          notifications.push({
            id: `notif-cancelled-${order.id}`,
            type: 'order',
            title: 'Commande annulée',
            message: `Votre commande ${order.orderNumber} a été annulée.`,
            date: order.date,
            isRead: false
          });
        }
      });
      setNotifications(notifications);
    }
    
    fetchUserDataAndOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fonctions pour gérer les notifications et favoris
  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // Mettre à jour le nombre de notifications non lues
    setUserStats(prev => {
      if (!prev) return null;
      return {
        ...prev,
        unreadNotificationCount: Math.max(0, prev.unreadNotificationCount - 1)
      };
    });
  };
  
  const deleteNotification = async (notificationId: string) => {
    // Vérifier si la notification à supprimer est non lue
    const notificationToDelete = notifications.find(n => n.id === notificationId);
    const isUnread = notificationToDelete && !notificationToDelete.isRead;
    
    // Supprimer la notification
    setNotifications(prev => {
      const updatedNotifications = prev.filter(notification => notification.id !== notificationId);
      
      // Si la notification était non lue, mettre à jour le nombre de notifications non lues
      if (isUnread) {
        setUserStats(prevStats => {
          if (!prevStats) return null;
          return {
            ...prevStats,
            unreadNotificationCount: Math.max(0, prevStats.unreadNotificationCount - 1)
          };
        });
      }
      
      return updatedNotifications;
    });
  };
  
  const addToCart = async (productId: string) => {
    console.log(`Ajout du produit ${productId} au panier`);
    // Ici, vous appelleriez votre service de panier
    // cartService.addItem(productId, 1);
  };
  
  // Mise à jour pour utiliser le service de favoris
  const removeFromFavorites = async (productId: string) => {
    if (!userDocId) {
      console.error("❌ Impossible de supprimer des favoris: ID utilisateur non disponible");
      return;
    }
    
    try {
      // Mise à jour UI immédiate pour une meilleure expérience utilisateur
      setFavorites(prev => prev.filter(product => product.id !== productId));
      
      // Mise à jour des statistiques
      setUserStats(prev => {
        if (!prev) return null;
        return {
          ...prev,
          favoriteCount: Math.max(0, prev.favoriteCount - 1)
        };
      });
      
      // Synchronisation avec Firestore
      await favoritesService.removeFromFavorites(userDocId, productId);
      console.log("✅ Favori supprimé avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du favori:", error);
      // En cas d'erreur, on pourrait réafficher l'élément supprimé
    }
  };
  
  // Nouvelle fonction pour ajouter aux favoris
  const addToFavorites = async (productId: string) => {
    if (!userDocId) {
      console.error("❌ Impossible d'ajouter aux favoris: ID utilisateur non disponible");
      return;
    }
    
    try {
      await favoritesService.addToFavorites(userDocId, productId);
      console.log("✅ Produit ajouté aux favoris");
      
      // Recharger les favoris pour mettre à jour l'UI
      const updatedFavorites = await favoritesService.getUserFavorites(userDocId);
      setFavorites(updatedFavorites);
      
      // Mettre à jour les statistiques
      setUserStats(prev => {
        if (!prev) return null;
        return {
          ...prev,
          favoriteCount: updatedFavorites.length
        };
      });
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout aux favoris:", error);
    }
  };
  
  // Fonction pour vérifier si un produit est en favori
  const isProductFavorite = async (productId: string): Promise<boolean> => {
    if (!userDocId) return false;
    
    try {
      return await favoritesService.isProductFavorite(userDocId, productId);
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des favoris:", error);
      return false;
    }
  };
  
  return {
    loading,
    error,
    userData,
    userStats,
    recentOrders,
    favorites,
    notifications,
    markNotificationAsRead,
    deleteNotification,
    addToCart,
    removeFromFavorites,
    addToFavorites,
    isProductFavorite,
    userDocId
  };
}