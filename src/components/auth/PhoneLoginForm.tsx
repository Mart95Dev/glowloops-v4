'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/lib/firebase/auth-service';
import { userService } from '@/lib/services/user-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { ChevronLeft, Loader2, Phone, ArrowRight } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';

// Schéma de validation pour le formulaire de numéro de téléphone
const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .regex(/^\+?[0-9\s\-\(\)]+$/, 'Format de numéro de téléphone invalide')
});

// Schéma de validation pour le formulaire de code de vérification
const codeSchema = z.object({
  verificationCode: z.string()
    .min(6, 'Le code doit contenir 6 chiffres')
    .max(6, 'Le code doit contenir 6 chiffres')
    .regex(/^[0-9]+$/, 'Le code doit contenir uniquement des chiffres')
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;

const PhoneLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Configuration du formulaire de téléphone
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors }
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: ''
    }
  });

  // Configuration du formulaire de code
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors }
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      verificationCode: ''
    }
  });

  // Gérer l'envoi du numéro de téléphone
  const onSubmitPhone = async (data: PhoneFormValues) => {
    if (!recaptchaContainerRef.current) return;
    
    setIsSubmitting(true);
    
    try {
      // Formater le numéro si nécessaire
      let formattedNumber = data.phoneNumber;
      if (!formattedNumber.startsWith('+')) {
        // Si le numéro ne commence pas par +, on ajoute l'indicatif français par défaut
        formattedNumber = `+33${formattedNumber.startsWith('0') ? formattedNumber.substring(1) : formattedNumber}`;
      }
      
      setPhoneNumber(formattedNumber);
      
      // Initialiser le reCAPTCHA
      const recaptchaVerifier = authService.initRecaptchaVerifier('recaptcha-container');
      
      // Envoyer le code de vérification par SMS
      const confirmationResult = await authService.sendVerificationCode(formattedNumber, recaptchaVerifier);
      setConfirmation(confirmationResult);
      
      // Passer à l'étape de vérification du code
      setStep('code');
      toast.success('Code envoyé !', { description: 'Veuillez vérifier vos SMS pour le code de vérification' });
    } catch (error) {
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la vérification du code
  const onSubmitCode = async (data: CodeFormValues) => {
    if (!confirmation) {
      toast.error('Une erreur est survenue', { description: 'Veuillez recommencer le processus' });
      setStep('phone');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier le code et se connecter
      const user = await authService.verifyPhoneCode(confirmation, data.verificationCode);
      
      // Créer un document utilisateur dans Firestore si c'est une première connexion
      try {
        await userService.createUserDocument(user, {
          // Le numéro de téléphone est normalement déjà dans user.phoneNumber
          // mais on le stocke aussi explicitement
          firstName: '',
          lastName: ''
        });
        console.log("✅ Document utilisateur créé après connexion par téléphone");
      } catch (error) {
        console.error("❌ Erreur lors de la création du document utilisateur:", error);
        // On continue même en cas d'erreur pour ne pas bloquer la connexion
      }
      
      toast.success('Connexion réussie !');
      router.push(redirectTo);
    } catch (error) {
      const errorCode = extractFirebaseErrorCode(error);
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retourner à l'étape du numéro de téléphone
  const handleBackToPhone = () => {
    setStep('phone');
    // Réinitialiser le reCAPTCHA
    if (recaptchaContainerRef.current) {
      recaptchaContainerRef.current.innerHTML = '';
    }
  };

  return (
    <div className="space-y-6">
      {step === 'phone' ? (
        <>
          <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="space-y-4">
            {/* Numéro de téléphone */}
            <div className="space-y-2">
              <label 
                htmlFor="phoneNumber" 
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de téléphone
              </label>
              <div className="flex items-center relative">
                <div className="absolute left-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-500" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
                    phoneErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...registerPhone('phoneNumber')}
                  disabled={isSubmitting}
                  autoComplete="tel"
                />
              </div>
              {phoneErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{phoneErrors.phoneNumber.message}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Un code de vérification sera envoyé à ce numéro. Des frais de message standard peuvent s&apos;appliquer.
              </p>
            </div>
            
            {/* Container pour le reCAPTCHA */}
            <div id="recaptcha-container" ref={recaptchaContainerRef} className="flex justify-center my-4"></div>
            
            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lilas-fonce hover:bg-lilas-clair text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Recevoir un code par SMS
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
          
          {/* Options de connexion alternatives */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/auth/login"
              className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium text-center sm:text-left"
            >
              Email et mot de passe
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              href="/auth/register"
              className="text-lilas-fonce hover:text-lilas-clair transition-colors font-medium text-center sm:text-left"
            >
              Créer un compte
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <button
              type="button"
              onClick={handleBackToPhone}
              className="flex items-center text-lilas-fonce hover:text-lilas-clair transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Retour</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmitCode(onSubmitCode)} className="space-y-4">
            <div className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">
                  Un code à 6 chiffres a été envoyé au
                </p>
                <p className="font-medium text-gray-800">
                  {phoneNumber}
                </p>
              </div>
              
              {/* Code de vérification */}
              <div className="space-y-2">
                <label 
                  htmlFor="verificationCode" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Code de vérification
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  className={`w-full px-4 py-3 border text-center text-lg font-medium tracking-wider rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-transparent transition-all ${
                    codeErrors.verificationCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...registerCode('verificationCode')}
                  disabled={isSubmitting}
                  autoComplete="one-time-code"
                  autoFocus
                />
                {codeErrors.verificationCode && (
                  <p className="text-red-500 text-xs mt-1">{codeErrors.verificationCode.message}</p>
                )}
              </div>
            </div>
            
            {/* Bouton de vérification */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lilas-fonce hover:bg-lilas-clair text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70 flex items-center justify-center mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Vérification...
                </>
              ) : (
                'Vérifier et se connecter'
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PhoneLoginForm; 