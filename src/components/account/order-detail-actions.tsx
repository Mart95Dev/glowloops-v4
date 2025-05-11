import { OrderStatus } from '@/lib/types/order';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { 
  AlertCircle, 
  RotateCcw, 
  MessageCircle, 
  FileText,
  HelpCircle,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface OrderDetailActionsProps {
  status: OrderStatus;
  onDownloadInvoice: () => void;
  onCancelOrder?: () => Promise<boolean>;
  onRequestReturn?: (reason: string) => Promise<boolean>;
  onContactSupport?: () => void;
}

export function OrderDetailActions({ 
  status, 
  onDownloadInvoice,
  onCancelOrder,
  onRequestReturn,
  onContactSupport
}: OrderDetailActionsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Fonction pour gérer l'annulation de la commande
  const handleCancelOrder = async () => {
    if (!onCancelOrder) return;
    
    setIsSubmitting(true);
    try {
      const success = await onCancelOrder();
      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setCancelDialogOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour gérer la demande de retour
  const handleRequestReturn = async () => {
    if (!onRequestReturn || !returnReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      const success = await onRequestReturn(returnReason);
      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setReturnDialogOpen(false);
          setSubmitSuccess(false);
          setReturnReason('');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la demande de retour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Déterminer les actions disponibles en fonction du statut
  const canCancel = status === 'pending' || status === 'processing';
  const canReturn = status === 'delivered';
  const canDownloadInvoice = status !== 'cancelled';
  
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-base font-medium mb-4">Actions disponibles</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Télécharger la facture */}
        {canDownloadInvoice && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5" 
            onClick={onDownloadInvoice}
          >
            <FileText className="w-4 h-4" />
            Télécharger la facture
          </Button>
        )}
        
        {/* Annuler la commande */}
        {canCancel && onCancelOrder && (
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              >
                <AlertCircle className="w-4 h-4" />
                Annuler la commande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Annuler la commande</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 my-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Informations importantes :</p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>Le remboursement sera traité dans un délai de 5 à 10 jours ouvrables.</li>
                      <li>Si vous avez déjà reçu un e-mail de confirmation d&apos;expédition, vous ne pourrez plus annuler la commande ici.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Annuler
                  </Button>
                </DialogClose>
                
                <Button 
                  variant="destructive"
                  disabled={isSubmitting || submitSuccess}
                  onClick={handleCancelOrder}
                  className={cn(
                    "min-w-[120px]",
                    submitSuccess && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isSubmitting ? (
                    "Traitement..."
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Confirmé
                    </span>
                  ) : (
                    "Confirmer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Demander un retour */}
        {canReturn && onRequestReturn && (
          <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <RotateCcw className="w-4 h-4" />
                Demander un retour
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Demander un retour</DialogTitle>
                <DialogDescription>
                  Merci de préciser la raison de votre demande de retour.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Expliquez pourquoi vous souhaitez retourner ce(s) produit(s)..."
                  value={returnReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReturnReason(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
                
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Politique de retour :</p>
                      <ul className="mt-1 list-disc list-inside">
                        <li>Vous disposez de 14 jours après réception pour effectuer un retour</li>
                        <li>Les articles doivent être retournés dans leur état d&apos;origine</li>
                        <li>Les frais de retour sont à votre charge, sauf produit défectueux</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Annuler
                  </Button>
                </DialogClose>
                
                <Button 
                  variant="default"
                  disabled={isSubmitting || submitSuccess || !returnReason.trim()}
                  onClick={handleRequestReturn}
                  className={cn(
                    "min-w-[120px]",
                    submitSuccess && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isSubmitting ? (
                    "Traitement..."
                  ) : submitSuccess ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Confirmé
                    </span>
                  ) : (
                    "Confirmer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Contacter le support */}
        {onContactSupport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5" 
                  onClick={onContactSupport}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contacter le support
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nous contacter à propos de cette commande</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
} 