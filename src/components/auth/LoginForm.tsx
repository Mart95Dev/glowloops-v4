'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/firebase/auth-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configuration du formulaire avec React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  // Gérer la soumission du formulaire
  const handleFormSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("📝 Tentative de connexion avec:", data.email);
      const user = await authService.loginWithEmailPassword(data.email, data.password);
      
      console.log("✅ Connexion réussie pour:", user.email);
      toast.success('Connexion réussie !');
      
      // Attendre un court instant pour que les données d'authentification soient enregistrées
      setTimeout(() => {
        // Vérifier explicitement que la session est bien enregistrée
        if (typeof window !== 'undefined') {
          // Vérifier si le localStorage contient les informations Firebase
          const firebaseAuthKey = Object.keys(localStorage).find(key => 
            key.startsWith('firebase:authUser:')
          );
          
          if (firebaseAuthKey) {
            console.log("✅ Clé Firebase trouvée dans localStorage, navigation vers:", redirectTo);
          } else {
            console.warn("⚠️ Aucune clé Firebase trouvée dans localStorage, vérification de notre système personnalisé");
            
            // Sauvegarder manuellement les données dans notre système local
            const customDataKey = 'glowloops_auth_persistent';
            const customAuthData = localStorage.getItem(customDataKey);
            
            if (!customAuthData) {
              console.warn("⚠️ Aucune donnée dans notre système personnalisé, sauvegarde manuelle");
              localStorage.setItem(customDataKey, JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastAuthenticated: Date.now(),
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
              }));
            }
          }
        }
        
        router.push(redirectTo);
      }, 500);
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error);
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  // Vérifier manuellement la validation du formulaire
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) ? true : 'Adresse email invalide';
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 6 ? true : 'Le mot de passe doit contenir au moins 6 caractères';
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Champ email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          {...register('email', { required: 'Email requis', validate: validateEmail })}
          className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-lilas-clair focus:border-lilas-clair"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      {/* Champ mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register('password', { required: 'Mot de passe requis', validate: validatePassword })}
            className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-lilas-clair focus:border-lilas-clair"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      {/* Mémoriser la session */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 text-lilas-fonce rounded border-gray-300 focus:ring-lilas-clair"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Se souvenir de moi
          </label>
        </div>
        
        <Link
          href="/auth/forgot-password"
          className="text-sm text-lilas-fonce hover:text-lilas-clair transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      
      {/* Bouton de connexion */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center py-3 px-4 rounded-full bg-lilas-fonce text-white hover:bg-lilas-clair font-medium transition-colors disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Connexion en cours...
          </>
        ) : (
          'Se connecter'
        )}
      </button>
      
      {/* Lien d'inscription */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link
            href="/auth/register"
            className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm; 