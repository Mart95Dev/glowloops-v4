'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/lib/firebase/auth-service';
import { userService } from '@/lib/services/user-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

// Schéma de validation du formulaire
const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phoneNumber: z.string().optional(),
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // On construit le displayName à partir du prénom et du nom
      const displayName = `${data.firstName} ${data.lastName}`;
      
      // Inscription avec Firebase Auth
      const firebaseUser = await authService.registerWithEmailPassword(data.email, data.password, displayName);
      
      // Créer un document utilisateur dans Firestore
      await userService.createUserDocument(firebaseUser, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null
      });
      
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Prénom */}
      <div className="space-y-2">
        <label 
          htmlFor="firstName" 
          className="block text-sm font-medium text-gray-700"
        >
          Prénom
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Jean"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('firstName')}
          disabled={isSubmitting}
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
        )}
      </div>
      
      {/* Nom */}
      <div className="space-y-2">
        <label 
          htmlFor="lastName" 
          className="block text-sm font-medium text-gray-700"
        >
          Nom
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Dupont"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('lastName')}
          disabled={isSubmitting}
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
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
      
      {/* Téléphone (optionnel) */}
      <div className="space-y-2">
        <label 
          htmlFor="phoneNumber" 
          className="block text-sm font-medium text-gray-700"
        >
          Téléphone <span className="text-gray-400 text-xs">(optionnel)</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('phoneNumber')}
          disabled={isSubmitting}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
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
            <a
              href="/conditions-generales"
              className="text-lilas-fonce hover:text-lilas-clair transition-colors"
            >
              conditions générales
            </a>
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
  );
};

export default RegisterForm; 