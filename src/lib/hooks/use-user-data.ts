import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { useAuth } from '@/lib/firebase/auth';
import { Order } from '@/components/account/order-summary';
import { FavoriteProduct } from '@/components/account/favorite-item';
import { NotificationItemProps } from '@/components/account/notification-item';

interface UserData {
  displayName: string;
  email: string;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  lastLogin: Date;
}

interface UserStats {
  orderCount: number;
  favoriteCount: number;
  unreadNotificationCount: number;
  totalSpent: number;
}

export function useUserData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Récupérer les données de l'utilisateur
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData({
            displayName: userData.displayName || user.displayName || '',
            email: userData.email || user.email || '',
            photoURL: userData.photoURL || user.photoURL,
            phoneNumber: userData.phoneNumber || user.phoneNumber,
            createdAt: userData.createdAt?.toDate() || new Date(),
            lastLogin: userData.lastLogin?.toDate() || new Date(),
          });

          // Récupérer les statistiques de l'utilisateur
          setUserStats({
            orderCount: userData.orderCount || 0,
            favoriteCount: userData.favoriteCount || 0,
            unreadNotificationCount: userData.unreadNotificationCount || 0,
            totalSpent: userData.totalSpent || 0,
          });
        } else {
          // Si l'utilisateur n'a pas de document dans Firestore, créer des données par défaut
          setUserData({
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            createdAt: new Date(),
            lastLogin: new Date(),
          });

          setUserStats({
            orderCount: 0,
            favoriteCount: 0,
            unreadNotificationCount: 0,
            totalSpent: 0,
          });
        }

        // Récupérer les commandes récentes
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData: Order[] = [];

        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            orderNumber: data.orderNumber,
            date: data.date.toDate(),
            status: data.status,
            totalAmount: data.totalAmount,
            items: data.items || [],
          });
        });

        setRecentOrders(ordersData);

        // Récupérer les favoris
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          limit(5)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const favoritesData: FavoriteProduct[] = [];

        favoritesSnapshot.forEach((doc) => {
          const data = doc.data();
          favoritesData.push({
            id: doc.id,
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl,
            slug: data.slug,
            isAvailable: data.isAvailable,
          });
        });

        setFavorites(favoritesData);

        // Récupérer les notifications
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(5)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notificationsData: NotificationItemProps[] = [];

        notificationsSnapshot.forEach((doc) => {
          const data = doc.data();
          notificationsData.push({
            id: doc.id,
            type: data.type,
            title: data.title,
            message: data.message,
            date: data.date.toDate(),
            isRead: data.isRead,
          });
        });

        setNotifications(notificationsData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
        setError('Impossible de récupérer les données utilisateur. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  // Fonction pour marquer une notification comme lue
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await getDoc(notificationRef); // Vérifier si la notification existe
      
      // Mettre à jour l'état local immédiatement pour une meilleure expérience utilisateur
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Mettre à jour le nombre de notifications non lues
      if (userStats) {
        setUserStats({
          ...userStats,
          unreadNotificationCount: Math.max(0, userStats.unreadNotificationCount - 1),
        });
      }

      // En production, mettre à jour Firestore ici
      // await updateDoc(notificationRef, { isRead: true });
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
    }
  };

  // Fonction pour supprimer une notification
  const deleteNotification = async (notificationId: string) => {
    try {
      // Mettre à jour l'état local immédiatement
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));

      // En production, supprimer de Firestore ici
      // const notificationRef = doc(db, 'notifications', notificationId);
      // await deleteDoc(notificationRef);
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
    }
  };

  // Fonction pour ajouter un produit au panier
  const addToCart = async (productId: string) => {
    try {
      // Cette fonction serait implémentée avec le store du panier
      console.log(`Produit ${productId} ajouté au panier`);
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
    }
  };

  // Fonction pour supprimer un produit des favoris
  const removeFromFavorites = async (productId: string) => {
    try {
      // Mettre à jour l'état local immédiatement
      setFavorites((prev) => prev.filter((product) => product.id !== productId));

      // Mettre à jour le nombre de favoris
      if (userStats) {
        setUserStats({
          ...userStats,
          favoriteCount: Math.max(0, userStats.favoriteCount - 1),
        });
      }

      // En production, supprimer de Firestore ici
      // const favoriteRef = doc(db, 'favorites', productId);
      // await deleteDoc(favoriteRef);
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
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
  };
} 