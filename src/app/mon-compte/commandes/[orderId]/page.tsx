'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, downloadOrderInvoice, cancelOrder, requestOrderReturn } from '@/lib/services/order-service';
import { Order, StatusChange } from '@/lib/types/order';
import { PageTitle } from '@/components/ui/page-title';
import { OrderSummary } from '@/components/account/order-summary';
import { OrderTracker } from '@/components/account/order-tracker';
import { OrderHistoryStatus } from '@/components/account/order-history-status';
import { OrderDetailActions } from '@/components/account/order-detail-actions';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

// Composant de chargement pour le contenu de la page
function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { orderId } = params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError(null);
      
      try {
        if (!orderId) {
          setError('ID de commande manquant');
          return;
        }
        
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError('Impossible de charger les détails de cette commande');
        
        // Rediriger vers la liste des commandes après un délai en cas d'erreur
        setTimeout(() => {
          router.push('/mon-compte/commandes');
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
    
    loadOrder();
  }, [orderId, router]);
  
  // Fonction pour télécharger la facture
  const handleDownloadInvoice = () => {
    if (!order) return;
    
    try {
      downloadOrderInvoice(order);
      toast.success('Téléchargement de la facture en cours');
    } catch (err) {
      console.error('Erreur lors du téléchargement de la facture:', err);
      toast.error('Impossible de télécharger la facture');
    }
  };
  
  // Fonction pour annuler la commande
  const handleCancelOrder = async (): Promise<boolean> => {
    if (!order) return false;
    
    try {
      await cancelOrder(order.id);
      
      // Mettre à jour l'ordre localement
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'cancelled',
          statusHistory: [
            ...(prev.statusHistory || []),
            {
              status: 'cancelled',
              timestamp: new Date(),
              note: 'Commande annulée par le client'
            }
          ]
        };
      });
      
      toast.success('La commande a été annulée avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
      toast.error('Impossible d\'annuler la commande');
      return false;
    }
  };
  
  // Fonction pour demander un retour
  const handleRequestReturn = async (reason: string): Promise<boolean> => {
    if (!order) return false;
    
    try {
      await requestOrderReturn(order.id, reason);
      
      // Mettre à jour l'ordre localement
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'returned',
          statusHistory: [
            ...(prev.statusHistory || []),
            {
              status: 'returned',
              timestamp: new Date(),
              note: `Retour demandé par le client. Raison: ${reason}`
            }
          ]
        };
      });
      
      toast.success('Votre demande de retour a été enregistrée');
      return true;
    } catch (err) {
      console.error('Erreur lors de la demande de retour:', err);
      toast.error('Impossible de traiter votre demande de retour');
      return false;
    }
  };
  
  // Fonction pour contacter le support
  const handleContactSupport = () => {
    router.push('/contact?subject=Commande ' + orderId);
  };
  
  // Si la page est en chargement
  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/mon-compte/commandes')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux commandes
        </Button>
        
        <OrderDetailSkeleton />
      </div>
    );
  }
  
  // Si une erreur est survenue
  if (error || !order) {
    return (
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/mon-compte/commandes')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux commandes
        </Button>
        
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            {error || 'Commande introuvable'}
          </h2>
          <p className="text-gray-600 mb-6">
            Nous n&apos;avons pas pu trouver les détails de cette commande. Vous allez être redirigé vers la liste de vos commandes.
          </p>
          <Button onClick={() => router.push('/mon-compte/commandes')}>
            Voir mes commandes
          </Button>
        </div>
      </div>
    );
  }
  
  // Obtenir l'historique des statuts pour l'affichage
  const statusHistory: StatusChange[] = order.statusHistory || [];
  
  // Formatter les dates pour l'affichage
  const formattedOrderDate = order.orderDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const expectedDeliveryDate = order.expectedDeliveryDate 
    ? order.expectedDeliveryDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Non disponible';
  
  return (
    <div className="container max-w-4xl py-8">
      {/* En-tête avec bouton retour */}
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.push('/mon-compte/commandes')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour aux commandes
      </Button>
      
      {/* Titre de la page */}
      <PageTitle 
        title={`Commande #${order.orderNumber || order.id.substring(0, 8)}`} 
        description={`Commandée le ${formattedOrderDate} • ${order.items.length} article${order.items.length > 1 ? 's' : ''}`}
      />
      
      {/* Onglets pour afficher différentes sections */}
      <Tabs defaultValue="resume" className="mt-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="resume">Résumé</TabsTrigger>
          <TabsTrigger value="suivi">Suivi</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
        </TabsList>
        
        {/* Onglet Résumé */}
        <TabsContent value="resume" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium mb-4">Détails de la commande</h2>
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande</span>
                  <span className="font-medium">{order.orderNumber || order.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de commande</span>
                  <span>{formattedOrderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison prévue</span>
                  <span>{expectedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className="font-medium">
                    {order.status === 'pending' && 'En attente'}
                    {order.status === 'processing' && 'En préparation'}
                    {order.status === 'shipped' && 'Expédiée'}
                    {order.status === 'delivered' && 'Livrée'}
                    {order.status === 'cancelled' && 'Annulée'}
                    {order.status === 'refunded' && 'Remboursée'}
                    {order.status === 'returned' && 'Retournée'}
                  </span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro de suivi</span>
                    <span className="font-medium">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Adresse de livraison</h2>
              <div className="border rounded-md p-4">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phoneNumber && <p className="mt-2">{order.shippingAddress.phoneNumber}</p>}
              </div>
            </div>
          </div>
          
          {/* Résumé financier */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
            <OrderSummary order={order} />
          </div>
          
          {/* Actions disponibles */}
          <OrderDetailActions
            status={order.status}
            onDownloadInvoice={handleDownloadInvoice}
            onCancelOrder={handleCancelOrder}
            onRequestReturn={handleRequestReturn}
            onContactSupport={handleContactSupport}
          />
        </TabsContent>
        
        {/* Onglet Suivi */}
        <TabsContent value="suivi" className="mt-0">
          <div className="border rounded-md p-6">
            <h2 className="text-lg font-medium mb-6">Statut de votre commande</h2>
            
            <OrderTracker 
              status={order.status} 
              trackingNumber={order.trackingNumber || undefined} 
            />
            
            {statusHistory.length > 0 && (
              <div className="mt-12">
                <OrderHistoryStatus statusHistory={statusHistory} />
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Onglet Produits */}
        <TabsContent value="produits" className="mt-0">
          <h2 className="text-lg font-medium mb-4">Articles commandés ({order.items.length})</h2>
          
          <div className="border rounded-md overflow-hidden">
            {order.items.map((item, index) => (
              <div 
                key={`${item.productId}-${index}`}
                className="flex items-center p-4 border-b last:border-b-0"
              >
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-400">
                      Pas d&apos;image
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">{item.productName}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  )}
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="font-medium">{item.price.toFixed(2)} €</span>
                  <span className="text-sm text-gray-500">Qté: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 