import { Order } from '@/lib/types/order';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
  order: Order;
  className?: string;
}

export function OrderSummary({ order, className }: OrderSummaryProps) {
  // Vérifier si order est défini pour éviter les erreurs
  if (!order || !order.items) {
    return (
      <div className={cn('border rounded-md overflow-hidden', className)}>
        <div className="p-4 text-center text-gray-500">
          Chargement des informations de commande...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      <div className="p-4 space-y-4">
        {/* En-tête */}
        <div className="border-b pb-3">
          <h3 className="font-medium text-lg">Récapitulatif</h3>
        </div>
        
        {/* Résumé des articles */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.productName} <span className="text-gray-500">x{item.quantity}</span>
              </span>
              <span>{(item.subtotal || 0).toFixed(2)} €</span>
            </div>
          ))}
        </div>
        
        {/* Frais et montants */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span>{(order.subtotal || 0).toFixed(2)} €</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frais de livraison</span>
            <span>{(order.shippingCost || 0).toFixed(2)} €</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">TVA (20%)</span>
            <span>{(order.tax || 0).toFixed(2)} €</span>
          </div>
          
          {order.discount && order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Remise</span>
              <span>-{order.discount.toFixed(2)} €</span>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-lilas-fonce">{(order.total || 0).toFixed(2)} €</span>
          </div>
          
          <div className="mt-1 text-xs text-gray-500">
            Paiement par {' '}
            {order.paymentMethod === 'card' && 'carte bancaire'}
            {order.paymentMethod === 'paypal' && 'PayPal'}
            {order.paymentMethod === 'bank_transfer' && 'virement bancaire'}
            {order.paymentMethod === 'other' && 'autre moyen'}
          </div>
        </div>
      </div>
    </div>
  );
} 