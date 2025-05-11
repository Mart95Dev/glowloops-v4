import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  PackageOpen, 
  XCircle, 
  AlertCircle, 
  RotateCcw 
} from 'lucide-react';
import { OrderStatus } from '@/lib/types/order';
import { cn } from '@/lib/utils';

// Définition des étapes d'une commande
const ORDER_STEPS = [
  {
    status: 'pending',
    label: 'En attente',
    description: 'Commande reçue, en attente de confirmation',
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
  },
  {
    status: 'processing',
    label: 'En préparation',
    description: 'Votre commande est en cours de préparation',
    icon: PackageOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    status: 'shipped',
    label: 'Expédiée',
    description: 'Votre commande a été expédiée',
    icon: Truck,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    status: 'delivered',
    label: 'Livrée',
    description: 'Votre commande a été livrée',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  }
];

// États exceptionnels (non inclus dans la progression normale)
const EXCEPTION_STATES = {
  cancelled: {
    label: 'Annulée',
    description: 'Cette commande a été annulée',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  refunded: {
    label: 'Remboursée',
    description: 'Cette commande a été remboursée',
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  returned: {
    label: 'Retournée',
    description: 'Cette commande a été retournée',
    icon: RotateCcw,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  }
};

interface OrderTrackerProps {
  status: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
}

export function OrderTracker({ status, trackingNumber, trackingUrl }: OrderTrackerProps) {
  // Si la commande est dans un état exceptionnel, afficher un message spécial
  if (status === 'cancelled' || status === 'refunded' || status === 'returned') {
    const exceptionState = EXCEPTION_STATES[status];
    
    return (
      <div className="flex flex-col items-center text-center">
        <div className={cn('p-4 rounded-full', exceptionState.bgColor)}>
          <exceptionState.icon className={cn('w-10 h-10', exceptionState.color)} />
        </div>
        <h3 className="text-lg font-medium mt-4">{exceptionState.label}</h3>
        <p className="text-gray-600 mt-2">{exceptionState.description}</p>
      </div>
    );
  }
  
  // Trouver l'index de l'étape actuelle
  const currentStepIndex = ORDER_STEPS.findIndex(step => step.status === status);
  
  return (
    <div className="w-full">
      {/* Barre de progression mobile */}
      <div className="md:hidden space-y-6">
        {ORDER_STEPS.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div 
              key={step.status} 
              className={cn(
                "flex items-start gap-4",
                isActive ? "" : "opacity-40"
              )}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "rounded-full p-2",
                  isActive ? step.bgColor : "bg-gray-100"
                )}>
                  <step.icon className={cn(
                    "w-5 h-5",
                    isActive ? step.color : "text-gray-400"
                  )} />
                </div>
                {index < ORDER_STEPS.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-10",
                    isActive && index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium",
                  isCurrent ? step.color : isActive ? "text-gray-900" : "text-gray-500"
                )}>
                  {step.label}
                </h4>
                <p className={cn(
                  "text-sm mt-1",
                  isCurrent ? "text-gray-800" : "text-gray-500"
                )}>
                  {step.description}
                </p>
                
                {/* Afficher le numéro de suivi si disponible */}
                {isCurrent && step.status === 'shipped' && trackingNumber && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Numéro de suivi: </span>
                    {trackingUrl ? (
                      <a 
                        href={trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lilas-fonce hover:underline"
                      >
                        {trackingNumber}
                      </a>
                    ) : (
                      <span className="font-medium">{trackingNumber}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Barre de progression desktop */}
      <div className="hidden md:block">
        <div className="flex justify-between mb-8">
          {ORDER_STEPS.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div 
                key={step.status} 
                className={cn(
                  "flex flex-col items-center flex-1 text-center",
                  index === 0 ? "items-start" : "",
                  index === ORDER_STEPS.length - 1 ? "items-end" : ""
                )}
              >
                <div className={cn(
                  "rounded-full p-3",
                  isActive ? step.bgColor : "bg-gray-100",
                  isCurrent ? "ring-2 ring-offset-2 ring-lilas-clair" : ""
                )}>
                  <step.icon className={cn(
                    "w-6 h-6",
                    isActive ? step.color : "text-gray-400"
                  )} />
                </div>
                <h4 className={cn(
                  "font-medium mt-3",
                  isCurrent ? step.color : isActive ? "text-gray-900" : "text-gray-500"
                )}>
                  {step.label}
                </h4>
                <p className={cn(
                  "text-sm mt-1 max-w-[150px]",
                  isCurrent ? "text-gray-800" : "text-gray-500"
                )}>
                  {step.description}
                </p>
                
                {/* Afficher le numéro de suivi si disponible */}
                {isCurrent && step.status === 'shipped' && trackingNumber && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Numéro de suivi: </span>
                    {trackingUrl ? (
                      <a 
                        href={trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lilas-fonce hover:underline"
                      >
                        {trackingNumber}
                      </a>
                    ) : (
                      <span className="font-medium">{trackingNumber}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Barre de progression */}
        <div className="relative w-full h-1 bg-gray-200 mt-2">
          <div 
            className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300"
            style={{ 
              width: `${Math.max(0, Math.min(100, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100))}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
} 