'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForceAuthPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("Initialisation...");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Fonction qui tente de forcer l'authentification à partir du localStorage
  const forceAuthentication = () => {
    try {
      // Étape 1: Vérifier si nous avons des données d'authentification
      let authData = null;
      let authSource = "";
      
      // Chercher d'abord une clé firebase:authUser
      const firebaseAuthKey = Object.keys(localStorage).find(key => 
        key.startsWith('firebase:authUser:')
      );
      
      if (firebaseAuthKey) {
        const rawData = localStorage.getItem(firebaseAuthKey);
        if (rawData) {
          authData = JSON.parse(rawData);
          authSource = "Firebase";
          console.log("Données Firebase extraites:", authData);
        }
      }
      
      // Si aucune donnée Firebase, essayer notre propre système
      if (!authData) {
        const customStorageData = localStorage.getItem('glowloops_auth_persistent');
        if (customStorageData) {
          authData = JSON.parse(customStorageData);
          authSource = "GlowLoops";
          console.log("Données GlowLoops extraites:", authData);
        }
      }
      
      // Si on a des données, forcer la restauration de session
      if (authData && authData.uid && authData.email) {
        // Enregistrer les données dans sessionStorage
        const sessionData = {
          uid: authData.uid,
          email: authData.email,
          displayName: authData.displayName || null,
          photoURL: authData.photoURL || null,
          lastAuthenticated: Date.now()
        };
        
        sessionStorage.setItem('glowloops_auth_session', JSON.stringify(sessionData));
        
        // Ajouter un flag spécial pour forcer l'accès au tableau de bord
        sessionStorage.setItem('force_auth_bypass', 'true');
        
        setMessage(`Authentification forcée réussie à partir de ${authSource} pour ${authData.email}. Redirection...`);
        return true;
      }
      
      setError("Aucune donnée d'authentification trouvée dans le navigateur.");
      return false;
    } catch (error) {
      console.error("Erreur lors de la restauration de l'authentification:", error);
      setError(`Erreur technique: ${error instanceof Error ? error.message : 'Inconnue'}`);
      return false;
    }
  };

  useEffect(() => {
    // Essayer de forcer l'authentification dès le chargement
    const success = forceAuthentication();
    
    // Si réussi, rediriger après un court délai
    if (success) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Rediriger vers le tableau de bord
            router.push('/mon-compte');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-playfair text-lilas-fonce mb-6">
          Authentification Forcée
        </h1>
        
        {error ? (
          <div className="mb-6">
            <div className="text-red-600 font-medium mb-4">Échec de l&apos;authentification</div>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm mb-6">
              Vous devez vous connecter normalement pour pouvoir utiliser cette fonction.
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <Link href="/auth/login" className="bg-lilas-fonce text-white px-6 py-2 rounded-full hover:bg-lilas-clair transition-colors">
                Se connecter
              </Link>
              <Link href="/auth-debug" className="text-lilas-fonce underline hover:text-lilas-clair transition-colors">
                Diagnostic
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-green-600 font-medium mb-4">{message}</p>
            <div className="my-4">
              <span className="inline-block w-10 h-10 bg-lilas-clair rounded-full text-white flex items-center justify-center text-xl font-bold">
                {countdown}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Redirection automatique dans {countdown} secondes...
            </p>
            <button 
              onClick={() => router.push('/mon-compte')}
              className="mt-6 bg-lilas-fonce text-white px-6 py-2 rounded-full hover:bg-lilas-clair transition-colors"
            >
              Continuer maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 