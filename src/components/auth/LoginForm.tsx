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
  const handleFormSubmit = (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    authService.loginWithEmailPassword(data.email, data.password)
      .then(() => {
        toast.success('Connexion réussie !');
        router.push(redirectTo);
      })
      .catch((error) => {
        const errorCode = extractFirebaseErrorCode(error);
        const errorMessage = getAuthErrorMessage(errorCode);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Vérifier manuellement la validation du formulaire
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) ? true : 'Adresse email invalide';
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 6 ? true : 'Le mot de passe doit contenir au moins 6 caractères';
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            {...register('email', { 
              required: 'Email requis',
              validate: validateEmail
            })}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Mot de passe */}
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('password', {
                required: 'Mot de passe requis',
                validate: validatePassword
              })}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        
        {/* Remember me & Mot de passe oublié */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-lilas-fonce focus:ring-lilas-clair border-gray-300 rounded"
              {...register('rememberMe')}
              disabled={isSubmitting}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-lilas-fonce hover:text-lilas-clair transition-colors"
            >
              Mot de passe oublié?
            </Link>
          </div>
        </div>
        
        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-lilas-fonce hover:bg-lilas-clair text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Connexion...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 