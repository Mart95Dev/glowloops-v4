'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/lib/firebase/auth-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

// Schéma de validation du formulaire
const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'Veuillez confirmer votre mot de passe'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions générales',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configuration du formulaire avec React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      await authService.registerWithEmailPassword(data.email, data.password, data.fullName);
      toast.success('Inscription réussie !');
      router.push('/');
    } catch (error) {
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gérer l'inscription avec Google
  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    
    try {
      await authService.loginWithGoogle();
      toast.success('Inscription réussie !');
      router.push('/');
    } catch (error) {
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nom complet */}
        <div className="space-y-2">
          <label 
            htmlFor="fullName" 
            className="block text-sm font-medium text-gray-700"
          >
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('fullName')}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>
        
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
              {...register('password')}
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
        
        {/* Confirmer mot de passe */}
        <div className="space-y-2">
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-700"
          >
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('confirmPassword')}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        {/* Accepter les conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              type="checkbox"
              className="h-4 w-4 text-lilas-fonce focus:ring-lilas-clair border-gray-300 rounded"
              {...register('acceptTerms')}
              disabled={isSubmitting}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="text-gray-700">
              J&apos;accepte les{' '}
              <Link
                href="/conditions-generales"
                className="text-lilas-fonce hover:text-lilas-clair transition-colors"
              >
                conditions générales
              </Link>
              {' '}de vente
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>
        
        {/* Bouton d'inscription */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-lilas-fonce hover:bg-lilas-clair text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Inscription...
            </>
          ) : (
            'S&apos;inscrire'
          )}
        </button>
      </form>
      
      {/* Séparateur */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">ou</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      {/* Inscription avec Google */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuer avec Google
      </button>
      
      {/* Lien de connexion */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Déjà un compte?{' '}
          <Link
            href="/auth/login"
            className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 