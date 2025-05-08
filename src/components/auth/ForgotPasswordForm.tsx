'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/lib/firebase/auth-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { Loader2 } from 'lucide-react';

// Schéma de validation du formulaire
const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  // Configuration du formulaire avec React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      await authService.resetPassword(data.email);
      setIsEmailSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Afficher un message de succès si l'email a été envoyé
  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800">
            Un email de réinitialisation a été envoyé à l&apos;adresse indiquée.
          </p>
          <p className="text-green-700 text-sm mt-2">
            Veuillez vérifier votre boîte de réception et suivre les instructions.
          </p>
        </div>
        
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-sm text-center">
        Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-lilas-fonce hover:bg-lilas-clair text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Envoi...
            </>
          ) : (
            'Envoyer le lien de réinitialisation'
          )}
        </button>
      </form>
      
      {/* Liens utiles */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-gray-600">
          <Link
            href="/auth/login"
            className="text-lilas-fonce hover:text-lilas-clair transition-colors"
          >
            Retour à la connexion
          </Link>
        </p>
        <p className="text-sm text-gray-600">
          Pas encore de compte?{' '}
          <Link
            href="/auth/register"
            className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 