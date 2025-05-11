'use client';

import { useState, useEffect } from 'react';
import { getUserOrders } from '@/lib/services/order-service';
import { Order } from '@/lib/types/order';
import { PageTitle } from '@/components/ui/page-title';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Package, ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Composant pour afficher l'état d'une commande
function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { 
      label: 'En attente', 
      color: 'bg-amber-100 text-amber-800 border-amber-200' 
    },
    processing: { 
      label: 'En préparation', 
      color: 'bg-blue-100 text-blue-800 border-blue-200' 
    },
    shipped: { 
      label: 'Expédiée', 
      color: 'bg-purple-100 text-purple-800 border-purple-200' 
    },
    delivered: { 
      label: 'Livrée', 
      color: 'bg-green-100 text-green-800 border-green-200' 
    },
    cancelled: { 
      label: 'Annulée', 
      color: 'bg-red-100 text-red-800 border-red-200' 
    },
    refunded: { 
      label: 'Remboursée', 
      color: 'bg-orange-100 text-orange-800 border-orange-200' 
    },
    returned: { 
      label: 'Retournée', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    },
  };

  const statusInfo = statusMap[status] || { 
    label: status, 
    color: 'bg-gray-100 text-gray-800 border-gray-200' 
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
      statusInfo.color
    )}>
      {statusInfo.label}
    </span>
  );
}

// Composant pour afficher un état de chargement
function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="mt-3 pt-3 border-t">
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant principal
export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const ordersList = await getUserOrders();
        setOrders(ordersList);
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Impossible de charger vos commandes');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  // Fonctions pour formater les dates
  function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Contenu en cas d'erreur
  if (error) {
    return (
      <div className="container py-8">
        <PageTitle 
          title="Mes commandes" 
          description="Consultez l'historique de vos commandes GlowLoops"
        />
        
        <div className="mt-8 p-6 border rounded-lg bg-red-50 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Une erreur est survenue</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-red-700 mb-6">Veuillez réessayer plus tard ou contacter notre support si le problème persiste.</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Contenu pendant le chargement
  if (loading) {
    return (
      <div className="container py-8">
        <PageTitle 
          title="Mes commandes" 
          description="Consultez l'historique de vos commandes GlowLoops"
        />
        <div className="mt-8">
          <OrdersSkeleton />
        </div>
      </div>
    );
  }

  // Contenu si aucune commande
  if (orders.length === 0) {
    return (
      <div className="container py-8">
        <PageTitle 
          title="Mes commandes" 
          description="Consultez l'historique de vos commandes GlowLoops"
        />
        
        <div className="mt-8 p-8 border rounded-lg text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune commande réalisée</h3>
          <p className="text-gray-500 mb-6">
            Vous n&apos;avez pas encore effectué d&apos;achat sur notre boutique.
          </p>
          <Button onClick={() => router.push('/boutique')}>
            Explorer notre catalogue
          </Button>
        </div>
      </div>
    );
  }

  // Contenu principal avec la liste des commandes
  return (
    <div className="container py-8">
      <PageTitle 
        title="Mes commandes" 
        description="Consultez l'historique de vos commandes GlowLoops"
      />
      
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link 
            key={order.id}
            href={`/mon-compte/commandes/${order.id}`}
            className="block border rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">
                    Commande #{order.orderNumber || order.id.substring(0, 8)}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(order.orderDate)} • {order.items.length} article{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-gray-400">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-sm">
                <div className="text-gray-600">
                  {order.items.map(item => item.productName).slice(0, 2).join(', ')}
                  {order.items.length > 2 && `, +${order.items.length - 2} autre(s)`}
                </div>
                <div className="font-medium">
                  {order.total.toFixed(2)} €
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 