'use client';

import { useUserData } from '@/lib/hooks/use-user-data';
import { DashboardWidget } from '@/components/account/dashboard-widget';
import { OrderSummary } from '@/components/account/order-summary';
import { FavoriteItem } from '@/components/account/favorite-item';
import { NotificationItem } from '@/components/account/notification-item';
import {
  User,
  ShoppingBag,
  Heart,
  Bell,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/lib/types/order';

// Définir le type OrderFront ici puisqu'il n'est pas exporté
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

export default function ProfilePage() {
  const {
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
  } = useUserData();
  
  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700">
        <h2 className="text-lg font-medium mb-2">Erreur</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Vérifier si on a des données à afficher
  const hasOrders = recentOrders.length > 0;
  const hasFavorites = favorites.length > 0;
  const hasNotifications = notifications.length > 0;
  
  // Ajoutez une fonction de transformation des données
  const adaptOrderFrontToOrder = (orderFront: OrderFront): Order => {
    return {
      id: orderFront.id,
      userId: "user_id", // valeur par défaut
      orderNumber: orderFront.orderNumber,
      items: orderFront.items.map((item: { id: string; productName: string; imageUrl: string; quantity: number }) => ({
        productId: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: 0, // valeur par défaut
        subtotal: 0, // valeur par défaut
        imageUrl: item.imageUrl
      })),
      shippingAddress: {
        fullName: "",
        address1: "",
        city: "",
        postalCode: "",
        country: ""
      },
      orderDate: orderFront.date,
      status: orderFront.status,
      subtotal: 0, // valeur par défaut 
      shippingCost: 0,
      tax: 0,
      total: orderFront.totalAmount,
      paymentMethod: "card" // valeur par défaut
    };
  };

  return (
    <>
      <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce mb-6">
        Tableau de bord
      </h1>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-lilas-clair/10 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-lilas-fonce mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">Commandes</span>
          </div>
          <div className="text-2xl font-medium">{recentOrders.length}</div>
        </div>
        
        <div className="bg-purple-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Favoris</span>
          </div>
          <div className="text-2xl font-medium">{userStats?.favoriteCount || 0}</div>
        </div>
        
        <div className="bg-amber-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          <div className="text-2xl font-medium">{userStats?.unreadNotificationCount || 0}</div>
        </div>
        
        <div className="bg-green-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium">Total dépensé</span>
          </div>
          <div className="text-2xl font-medium">
            {(userStats?.totalSpent || 0).toLocaleString('fr-FR', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0 
            })}
          </div>
        </div>
      </div>
      
      {/* Sections principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Commandes */}
        <DashboardWidget
          title="Commandes récentes"
          icon={<ShoppingBag className="w-5 h-5" />}
          footer={hasOrders ? { label: "Voir toutes mes commandes", href: "/mon-compte/commandes" } : undefined}
        >
          {hasOrders ? (
            <div className="space-y-3">
              {recentOrders.slice(0, 3).map((order) => (
                <OrderSummary key={order.id} order={adaptOrderFrontToOrder(order)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-gray-300 mb-3">
                <ShoppingBag className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-gray-700 font-medium mb-1">Pas encore de commande</h3>
              <p className="text-gray-500 text-sm mb-4">
                Vous n&apos;avez pas encore passé de commande
              </p>
              <Link
                href="/shop"
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Explorer la boutique
              </Link>
            </div>
          )}
        </DashboardWidget>
        
        {/* Section Favoris */}
        <DashboardWidget
          title="Favoris"
          icon={<Heart className="w-5 h-5" />}
          footer={hasFavorites ? { label: "Gérer mes favoris", href: "/mon-compte/favoris" } : undefined}
        >
          {hasFavorites ? (
            <div className="space-y-3">
              {favorites.slice(0, 3).map((product) => (
                <FavoriteItem 
                  key={product.id} 
                  product={product} 
                  onRemove={removeFromFavorites}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-gray-300 mb-3">
                <Heart className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-gray-700 font-medium mb-1">Pas encore de favoris</h3>
              <p className="text-gray-500 text-sm mb-4">
                Ajoutez des produits à vos favoris pour les retrouver facilement
              </p>
              <Link
                href="/shop"
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Découvrir nos produits
              </Link>
            </div>
          )}
        </DashboardWidget>
        
        {/* Section Activité récente */}
        <DashboardWidget
          title="Activité récente"
          icon={<Clock className="w-5 h-5" />}
          className="md:col-span-2"
        >
          <div className="space-y-2">
            {hasNotifications ? (
              notifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={markNotificationAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-gray-300 mb-3">
                  <Bell className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-gray-700 font-medium mb-1">Pas de notifications</h3>
                <p className="text-gray-500 text-sm">
                  Vous serez informé ici des mises à jour importantes
                </p>
              </div>
            )}
          </div>
        </DashboardWidget>
        
        {/* Section Informations du compte */}
        <DashboardWidget
          title="Informations du compte"
          icon={<User className="w-5 h-5" />}
          footer={{ label: "Modifier mes informations", href: "/mon-compte/profil" }}
          className="md:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Nom</h4>
              <p className="font-medium">{userData?.displayName || 'Non renseigné'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p className="font-medium">{userData?.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h4>
              <p className="font-medium">{userData?.phoneNumber || 'Non renseigné'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Membre depuis</h4>
              <p className="font-medium">
                {userData?.createdAt && 
                  (
                    userData.createdAt instanceof Date
                      ? userData.createdAt
                      : 'toDate' in userData.createdAt
                        ? userData.createdAt.toDate()
                        : new Date(userData.createdAt)
                  ).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Votre compte est sécurisé</span>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </>
  );
} 