'use client';

import { useState } from 'react';
import { useUserData } from '@/lib/hooks/use-user-data';
import { NotificationItem, NotificationType } from '@/components/account/notification-item';
import { Bell, Filter, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { loading, error, notifications, markNotificationAsRead, deleteNotification } = useUserData();
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [showReadNotifications, setShowReadNotifications] = useState(true);
  
  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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

  // Filtrer les notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesRead = showReadNotifications || !notification.isRead;
    
    return matchesType && matchesRead;
  });
  
  // Nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce">
          Notifications 
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-sm bg-amber-100 text-amber-700 rounded-full">
              {unreadCount} non {unreadCount === 1 ? 'lue' : 'lues'}
            </span>
          )}
        </h1>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-lilas-fonce hover:text-lilas-clair"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>
      
      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
          >
            <option value="all">Tous les types</option>
            <option value="info">Informations</option>
            <option value="order">Commandes</option>
            <option value="promo">Promotions</option>
            <option value="system">Système</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showRead"
            checked={showReadNotifications}
            onChange={(e) => setShowReadNotifications(e.target.checked)}
            className="rounded border-gray-300 text-lilas-fonce focus:ring-lilas-clair"
          />
          <label htmlFor="showRead" className="ml-2 text-sm text-gray-700">
            Afficher les notifications lues
          </label>
        </div>
      </div>
      
      {/* Liste des notifications */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onMarkAsRead={markNotificationAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-300 mb-4">
            <Bell className="w-12 h-12 mx-auto" />
          </div>
          {typeFilter !== 'all' || !showReadNotifications ? (
            <>
              <h3 className="text-gray-700 font-medium mb-1">Aucune notification trouvée</h3>
              <p className="text-gray-500 text-sm mb-4">
                Essayez de modifier vos filtres
              </p>
              <button 
                onClick={() => {
                  setTypeFilter('all');
                  setShowReadNotifications(true);
                }}
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </>
          ) : (
            <>
              <h3 className="text-gray-700 font-medium mb-1">Pas de notification</h3>
              <p className="text-gray-500 text-sm">
                Vous serez informé ici des mises à jour importantes
              </p>
            </>
          )}
        </div>
      )}
      
      {/* Bouton de nettoyage */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => filteredNotifications.forEach(n => deleteNotification(n.id))}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer toutes les notifications affichées
          </button>
        </div>
      )}
    </>
  );
} 