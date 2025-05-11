import { Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface pour un changement de statut
export interface StatusChange {
  status: string;
  timestamp: Date;
  note?: string;
}

interface OrderHistoryStatusProps {
  statusHistory: StatusChange[];
}

// Fonction pour traduire les statuts en français
function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En préparation',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée',
    'refunded': 'Remboursée',
    'payment_confirmed': 'Paiement confirmé',
    'returned': 'Retour initié',
  };
  
  return statusMap[status] || status;
}

// Fonction pour obtenir les couleurs en fonction du statut
function getStatusColors(status: string): { bg: string, text: string, border: string } {
  switch (status) {
    case 'pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'processing':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'shipped':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'delivered':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    case 'cancelled':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'refunded':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'payment_confirmed':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'returned':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
}

// Fonction pour formater la date
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Fonction pour formater l'heure
function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderHistoryStatus({ statusHistory }: OrderHistoryStatusProps) {
  // Trier l'historique par date (du plus récent au plus ancien)
  const sortedHistory = [...statusHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  return (
    <div className="space-y-1">
      <h3 className="text-base font-medium mb-3">Historique de la commande</h3>
      
      <div className="border rounded-lg overflow-hidden">
        {sortedHistory.map((change, index) => {
          const colors = getStatusColors(change.status);
          
          return (
            <div 
              key={`${change.status}-${change.timestamp.getTime()}`}
              className={cn(
                "flex flex-col p-4 gap-2",
                index !== 0 && "border-t"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    colors.bg, colors.text, colors.border
                  )}>
                    {translateStatus(change.status)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(change.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(change.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              {change.note && (
                <p className="text-sm text-gray-600 mt-1">
                  {change.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Message si l'historique est vide */}
      {statusHistory.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun historique disponible pour cette commande.</p>
        </div>
      )}
    </div>
  );
} 