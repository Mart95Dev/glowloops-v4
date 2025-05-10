'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/firebase-config';
import { isAuthenticated, getAuthenticatedUser } from '@/lib/firebase/auth-session';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { user: firebaseUser, loading, error } = useAuth();
  const [sessionAuthStatus, setSessionAuthStatus] = useState<boolean | null>(null);
  const [sessionUser, setSessionUser] = useState<ReturnType<typeof getAuthenticatedUser>>(null);
  const [localStorageContent, setLocalStorageContent] = useState<Record<string, string>>({});
  const [sessionStorageContent, setSessionStorageContent] = useState<Record<string, string>>({});
  const [firebaseAuthObject, setFirebaseAuthObject] = useState<string>('');

  // Récupérer les informations de diagnostic
  useEffect(() => {
    // Vérifier le statut d'authentification de notre système de session
    setSessionAuthStatus(isAuthenticated());
    setSessionUser(getAuthenticatedUser());
    
    // Récupérer les données de localStorage et sessionStorage
    if (typeof window !== 'undefined') {
      try {
        // localStorage
        const localStorageData: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            localStorageData[key] = localStorage.getItem(key) || '';
          }
        }
        setLocalStorageContent(localStorageData);
        
        // sessionStorage
        const sessionStorageData: Record<string, string> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            sessionStorageData[key] = sessionStorage.getItem(key) || '';
          }
        }
        setSessionStorageContent(sessionStorageData);
        
        // Firebase Auth Object
        setFirebaseAuthObject(JSON.stringify(auth.currentUser, null, 2));
      } catch (error) {
        console.error("Erreur lors de la récupération des données de stockage:", error);
      }
    }
  }, []);

  if (loading) {
    return <div className="p-8">Chargement des informations d&apos;authentification...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-lilas-fonce text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">Diagnostic d&apos;authentification</h1>
          <Link href="/"
            className="bg-white text-lilas-fonce px-3 py-1 rounded-full text-sm hover:bg-opacity-90 transition-colors">
            Retour au site
          </Link>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statut Firebase Auth */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2 text-lilas-fonce">Firebase Auth</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Statut:</span>{' '}
                  <span className={`px-2 py-1 rounded text-sm ${firebaseUser ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {firebaseUser ? 'Authentifié' : 'Non authentifié'}
                  </span>
                </div>
                {firebaseUser && (
                  <>
                    <div><span className="font-medium">UID:</span> {firebaseUser.uid}</div>
                    <div><span className="font-medium">Email:</span> {firebaseUser.email}</div>
                    <div><span className="font-medium">Méthode:</span> {firebaseUser.providerData[0]?.providerId || 'inconnue'}</div>
                  </>
                )}
                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    Erreur: {error.message}
                  </div>
                )}
              </div>
            </div>

            {/* Statut Session Custom */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2 text-lilas-fonce">Système de Session Custom</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Statut:</span>{' '}
                  <span className={`px-2 py-1 rounded text-sm ${sessionAuthStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sessionAuthStatus ? 'Authentifié' : 'Non authentifié'}
                  </span>
                </div>
                {sessionUser && (
                  <>
                    <div><span className="font-medium">UID:</span> {sessionUser.uid}</div>
                    <div><span className="font-medium">Email:</span> {sessionUser.email}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contenu du localStorage */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2 text-lilas-fonce">localStorage</h2>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-xs overflow-auto max-h-40">
              {Object.keys(localStorageContent).length > 0 
                ? JSON.stringify(localStorageContent, null, 2)
                : "Aucune donnée dans localStorage"}
            </pre>
          </div>

          {/* Contenu du sessionStorage */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2 text-lilas-fonce">sessionStorage</h2>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-xs overflow-auto max-h-40">
              {Object.keys(sessionStorageContent).length > 0 
                ? JSON.stringify(sessionStorageContent, null, 2)
                : "Aucune donnée dans sessionStorage"}
            </pre>
          </div>

          {/* Objet auth.currentUser */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2 text-lilas-fonce">auth.currentUser</h2>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-xs overflow-auto max-h-40">
              {firebaseAuthObject || 'null'}
            </pre>
          </div>

          {/* Actions de débogage */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button 
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Effacer les stockages et recharger
            </button>
            
            <Link 
              href="/auth/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Page de connexion
            </Link>
            
            <Link 
              href="/mon-compte"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tester l&apos;accès au tableau de bord
            </Link>

            <button 
              onClick={() => {
                try {
                  // Extraire les informations d'authentification et les réappliquer
                  let authData = null;
                  
                  // Chercher d'abord une clé firebase:authUser
                  const firebaseAuthKey = Object.keys(localStorage).find(key => 
                    key.startsWith('firebase:authUser:')
                  );
                  
                  if (firebaseAuthKey) {
                    const rawData = localStorage.getItem(firebaseAuthKey);
                    if (rawData) {
                      authData = JSON.parse(rawData);
                      console.log("Données Firebase extraites:", authData);
                    }
                  }
                  
                  // Si aucune donnée Firebase, essayer notre propre système
                  if (!authData) {
                    const customStorageData = localStorage.getItem('glowloops_auth_persistent');
                    if (customStorageData) {
                      authData = JSON.parse(customStorageData);
                      console.log("Données custom extraites:", authData);
                    }
                  }
                  
                  // Si on a des données, forcer la restauration de session
                  if (authData && authData.uid && authData.email) {
                    // Enregistrer également dans sessionStorage
                    const sessionData = {
                      uid: authData.uid,
                      email: authData.email,
                      displayName: authData.displayName || null,
                      photoURL: authData.photoURL || null,
                      lastAuthenticated: Date.now()
                    };
                    sessionStorage.setItem('glowloops_auth_session', JSON.stringify(sessionData));
                    alert(`Session restaurée pour ${authData.email}. Essayez maintenant d'accéder au tableau de bord.`);
                  } else {
                    alert("Aucune donnée d'authentification trouvée. Connectez-vous d'abord.");
                  }
                } catch (error) {
                  console.error("Erreur lors de la restauration de session:", error);
                  alert("Erreur lors de la restauration de session.");
                }
              }}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Force restauration session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 