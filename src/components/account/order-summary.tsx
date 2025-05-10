import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Package } from 'lucide-react';

export interface OrderItem {
  id: string;
  productName: string;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

interface OrderSummaryProps {
  order: Order;
}

// Fonction pour traduire le statut de la commande
function translateOrderStatus(status: Order['status']): string {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'processing':
      return 'En préparation';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return 'Inconnue';
  }
}

// Fonction pour obtenir la couleur du badge selon le statut
function getStatusBadgeColor(status: Order['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'processing':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'shipped':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'delivered':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'cancelled':
      return 'bg-red-50 text-red-600 border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const statusColor = getStatusBadgeColor(order.status);
  const statusText = translateOrderStatus(order.status);
  
  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
        <div>
          <Link href={`/mon-compte/commandes/${order.id}`} className="font-medium text-lilas-fonce hover:text-lilas-clair">
            Commande #{order.orderNumber}
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calendar className="w-4 h-4" />
            <span>{order.date.toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor} border`}>
          {statusText}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
        </div>
        <div className="font-medium">
          {order.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={item.imageUrl}
              alt={item.productName}
              width={48}
              height={48}
              className="object-cover"
            />
            {item.quantity > 1 && (
              <div className="absolute bottom-0 right-0 bg-white rounded-tl-md text-xs px-1 border-l border-t border-gray-200">
                ×{item.quantity}
              </div>
            )}
          </div>
        ))}
        
        {order.items.length > 3 && (
          <div className="flex-shrink-0 w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-500">+{order.items.length - 3}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <Link 
          href={`/mon-compte/commandes/${order.id}`}
          className="text-sm font-medium text-lilas-fonce hover:text-lilas-clair"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
} 