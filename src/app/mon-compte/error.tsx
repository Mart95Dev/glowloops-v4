'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Enregistrer l'erreur dans la console
    console.error('Erreur dans l\'espace client:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="text-2xl font-playfair text-lilas-fonce mb-4">
          Erreur d&apos;accès
        </h1>
        <p className="text-gray-600 mb-6">
          Nous rencontrons un problème pour accéder à votre espace client. 
          Cela peut être dû à un problème d&apos;authentification.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-lilas-fonce text-white rounded-lg hover:bg-lilas-clair transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/auth/login?redirectTo=/mon-compte"
            className="block w-full py-2 px-4 border border-lilas-fonce text-lilas-fonce rounded-lg hover:bg-lilas-clair/10 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/"
            className="block text-sm text-gray-500 hover:text-lilas-fonce"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
} 