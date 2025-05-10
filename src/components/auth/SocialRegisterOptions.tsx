'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/firebase/auth-service';
import { userService } from '@/lib/services/user-service';
import { extractFirebaseErrorCode, getAuthErrorMessage } from '@/lib/utils/auth-error-utils';
import { toast } from '@/lib/utils/toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SocialRegisterOptions = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gérer l'inscription avec Google
  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    
    try {
      // Utiliser la méthode dédiée à l'inscription avec Google
      const firebaseUser = await authService.registerWithGoogle();
      
      // Créer un document utilisateur dans Firestore
      await userService.createUserDocument(firebaseUser);
      
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
    <div className="flex flex-col w-full h-full justify-center">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Inscription rapide</h3>
        <p className="text-sm text-gray-500">Créez votre compte en un clic</p>
      </div>

      <div className="space-y-4">
        {/* Inscription avec Google */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
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
              <span>S&apos;inscrire avec Google</span>
            </>
          )}
        </button>
        
        {/* Inscription par SMS */}
        <Link
          href="/auth/phone-login"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilas-clair"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>Inscription par SMS</span>
        </Link>
      </div>

      {/* Déjà un compte */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
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

export default SocialRegisterOptions; 