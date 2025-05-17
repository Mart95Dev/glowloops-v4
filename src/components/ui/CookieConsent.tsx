'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiChevronDown } from 'react-icons/hi';

// Types pour le consentement des cookies
export type CookieConsentStatus = 'pending' | 'accepted' | 'rejected' | 'customized';

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export interface CookieConsentOptions {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Clés pour le localStorage
const COOKIE_CONSENT_KEY = 'glowloops_cookie_consent';
const COOKIE_CONSENT_OPTIONS_KEY = 'glowloops_cookie_consent_options';

export default function CookieConsent() {
  const [cookieOptions, setCookieOptions] = useState<CookieConsentOptions>({
    necessary: true, // Toujours requis
    functional: false,
    analytics: false,
    marketing: false,
  });
  
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialiser au montage du composant (côté client uniquement)
  useEffect(() => {
    setMounted(true);
    
    try {
      // Vérifier si window est défini (côté client uniquement)
      if (typeof window !== 'undefined') {
        // Récupérer depuis localStorage
        const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
        const storedOptions = window.localStorage.getItem(COOKIE_CONSENT_OPTIONS_KEY);
        
        if (storedConsent) {
          if (storedOptions) {
            try {
              const parsedOptions = JSON.parse(storedOptions);
              setCookieOptions(parsedOptions);
            } catch (e) {
              // Gérer l'erreur de parsing JSON
              console.error("Erreur lors du parsing des options de cookies:", e);
            }
          }
          // Cacher la bannière si le consentement existe déjà
          setShowBanner(false);
        } else {
          // Montrer la bannière si pas de consentement existant
          setShowBanner(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du consentement des cookies:", error);
      if (mounted) {
        setShowBanner(true);
      }
    }
  }, [mounted]);

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    if (!mounted) return;
    
    const options: CookieConsentOptions = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    setCookieOptions(options);
    setShowBanner(false);
    
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      window.localStorage.setItem(COOKIE_CONSENT_OPTIONS_KEY, JSON.stringify(options));
    } catch (e) {
      console.error("Erreur lors de l'enregistrement du consentement des cookies:", e);
    }
  };

  // Rejeter tous les cookies non essentiels
  const rejectAllCookies = () => {
    if (!mounted) return;
    
    const options: CookieConsentOptions = {
      necessary: true, // Toujours requis
      functional: false,
      analytics: false,
      marketing: false,
    };
    
    setCookieOptions(options);
    setShowBanner(false);
    
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
      window.localStorage.setItem(COOKIE_CONSENT_OPTIONS_KEY, JSON.stringify(options));
    } catch (e) {
      console.error("Erreur lors de l'enregistrement du rejet des cookies:", e);
    }
  };

  // Personnaliser les options de cookies
  const customizeCookies = () => {
    if (!mounted) return;
    
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'customized');
      window.localStorage.setItem(COOKIE_CONSENT_OPTIONS_KEY, JSON.stringify(cookieOptions));
      
      setShowBanner(false);
      setShowSettings(false);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement des options de cookies:", e);
    }
  };

  // Toggle une option de cookie
  const toggleOption = (option: CookieCategory) => {
    if (option === 'necessary') return; // On ne peut pas désactiver les cookies nécessaires
    
    setCookieOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg md:text-xl font-display font-semibold">
              🍪 Votre vie privée est importante
            </h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site, conformément au 
            <Link href="/politique-de-confidentialite" className="underline text-lilas-fonce ml-1">
              RGPD
            </Link>. 
            Vous pouvez choisir les cookies que vous acceptez et modifier vos préférences à tout moment.
            Même si vous refusez les cookies, nous collectons des données basiques anonymisées pour des raisons d&apos;analyse, comme expliqué dans notre politique de confidentialité.
          </p>
          
          {showSettings && (
            <div className="my-4 border-t border-b py-4">
              <div className="space-y-4">
                {/* Cookies nécessaires */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Cookies nécessaires</h3>
                    <p className="text-xs text-gray-500">Permettent au site de fonctionner correctement. Ils ne peuvent pas être désactivés.</p>
                  </div>
                  <div className="relative inline-block w-10 h-5 bg-gray-200 rounded-full">
                    <span className="absolute inset-0 flex items-center justify-end pr-1">
                      <span className="w-4 h-4 bg-lilas-fonce rounded-full"></span>
                    </span>
                  </div>
                </div>
                
                {/* Cookies fonctionnels */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Cookies fonctionnels</h3>
                    <p className="text-xs text-gray-500">Améliorent l&apos;expérience utilisateur (ex: mémorisation du panier).</p>
                  </div>
                  <button 
                    onClick={() => toggleOption('functional')}
                    className={`relative inline-block w-10 h-5 ${cookieOptions.functional ? 'bg-lilas-fonce' : 'bg-gray-200'} rounded-full transition-colors`}
                  >
                    <span className={`absolute inset-0 flex items-center ${cookieOptions.functional ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                      <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </span>
                  </button>
                </div>
                
                {/* Cookies d'analyse */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Cookies d&apos;analyse</h3>
                    <p className="text-xs text-gray-500">Nous aident à comprendre comment vous utilisez notre site.</p>
                  </div>
                  <button 
                    onClick={() => toggleOption('analytics')}
                    className={`relative inline-block w-10 h-5 ${cookieOptions.analytics ? 'bg-lilas-fonce' : 'bg-gray-200'} rounded-full transition-colors`}
                  >
                    <span className={`absolute inset-0 flex items-center ${cookieOptions.analytics ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                      <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </span>
                  </button>
                </div>
                
                {/* Cookies marketing */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Cookies marketing</h3>
                    <p className="text-xs text-gray-500">Permettent d&apos;afficher des publicités pertinentes.</p>
                  </div>
                  <button 
                    onClick={() => toggleOption('marketing')}
                    className={`relative inline-block w-10 h-5 ${cookieOptions.marketing ? 'bg-lilas-fonce' : 'bg-gray-200'} rounded-full transition-colors`}
                  >
                    <span className={`absolute inset-0 flex items-center ${cookieOptions.marketing ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                      <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded flex items-center justify-center sm:justify-start"
            >
              Paramètres {showSettings ? <HiChevronDown className="ml-1 transform rotate-180" /> : <HiChevronDown className="ml-1" />}
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={rejectAllCookies}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Accepter l&apos;essentiel
              </button>
              
              {showSettings ? (
                <button
                  onClick={customizeCookies}
                  className="flex-1 px-4 py-2 text-white bg-lilas-fonce rounded hover:bg-lilas-clair transition-colors"
                >
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  onClick={acceptAllCookies}
                  className="flex-1 px-4 py-2 text-white bg-lilas-fonce rounded hover:bg-lilas-clair transition-colors"
                >
                  Tout accepter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour tester la bannière de cookies
export function CookieBannerTest() {
  return (
    <div className="fixed top-20 right-4 z-50">
      <button 
        onClick={() => {
          // Suppression des cookies de consentement pour forcer l'affichage de la bannière
          localStorage.removeItem(COOKIE_CONSENT_KEY);
          localStorage.removeItem(COOKIE_CONSENT_OPTIONS_KEY);
          // Rafraîchissement de la page
          window.location.reload();
        }}
        className="bg-lilas-fonce text-white px-4 py-2 rounded-md shadow-md text-sm"
      >
        Tester Bannière Cookies
      </button>
    </div>
  );
} 