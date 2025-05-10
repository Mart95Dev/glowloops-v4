import { useState } from 'react';
import { X, Bell, ShoppingBag, Gift, Tag } from 'lucide-react';

export type NotificationType = 'info' | 'order' | 'promo' | 'system';

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Fonction pour formater la date
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    return `Le ${date.toLocaleDateString('fr-FR')}`;
  }
}

// Fonction pour obtenir l'icône selon le type de notification
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-5 h-5" />;
    case 'promo':
      return <Tag className="w-5 h-5" />;
    case 'system':
      return <Bell className="w-5 h-5" />;
    case 'info':
    default:
      return <Gift className="w-5 h-5" />;
  }
}

// Fonction pour obtenir la couleur selon le type de notification
function getNotificationColor(type: NotificationType) {
  switch (type) {
    case 'order':
      return 'bg-blue-50 text-blue-600';
    case 'promo':
      return 'bg-green-50 text-green-600';
    case 'system':
      return 'bg-orange-50 text-orange-600';
    case 'info':
    default:
      return 'bg-purple-50 text-purple-600';
  }
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  date,
  isRead,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(true);
  const icon = getNotificationIcon(type);
  const iconColor = getNotificationColor(type);
  
  const handleDelete = () => {
    setIsVisible(false);
    // Délai pour l'animation de suppression
    setTimeout(() => {
      onDelete?.(id);
    }, 300);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      className={`relative transition-all duration-300 ${
        isRead ? 'opacity-70' : ''
      }`}
    >
      <div className={`border rounded-lg p-4 mb-3 ${
        isRead ? 'bg-white' : 'bg-gray-50'
      } hover:shadow-sm transition-shadow`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${iconColor} p-2 rounded-full mr-3`}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {formatDate(date)}
                </span>
                {onDelete && (
                  <button 
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Supprimer la notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{message}</p>
            
            {!isRead && onMarkAsRead && (
              <button 
                onClick={() => onMarkAsRead(id)} 
                className="text-xs font-medium text-lilas-fonce hover:text-lilas-clair"
              >
                Marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 