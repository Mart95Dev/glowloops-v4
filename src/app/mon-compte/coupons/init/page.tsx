'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initCouponsForUser, addUsedCouponForUser } from '@/lib/firebase/init-coupons';
import { auth } from '@/lib/firebase/firebase-config';

export default function InitCouponsPage() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAddingUsed, setIsAddingUsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitCoupons = async () => {
    setIsInitializing(true);
    setMessage(null);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setError('Utilisateur non connecté');
        setIsInitializing(false);
        return;
      }
      
      const userId = currentUser.uid;
      await initCouponsForUser(userId);
      
      setMessage('Bons de réduction initialisés avec succès');
      setTimeout(() => {
        router.push('/mon-compte/coupons');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des bons:', err);
      setError('Une erreur est survenue lors de l\'initialisation des bons');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAddUsedCoupon = async () => {
    setIsAddingUsed(true);
    setMessage(null);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setError('Utilisateur non connecté');
        setIsAddingUsed(false);
        return;
      }
      
      const userId = currentUser.uid;
      await addUsedCouponForUser(userId);
      
      setMessage('Bon de réduction utilisé ajouté avec succès');
      setTimeout(() => {
        router.push('/mon-compte/coupons');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bon utilisé:', err);
      setError('Une erreur est survenue lors de l\'ajout du bon utilisé');
    } finally {
      setIsAddingUsed(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Initialisation des bons de réduction</h1>
      
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4 mb-6">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Bons actifs</h2>
          <p className="text-gray-600 mb-4">
            Initialiser des bons de réduction actifs pour votre compte. Cette opération ne créera
            des bons que si vous n&apos;en avez pas déjà.
          </p>
          <button
            onClick={handleInitCoupons}
            disabled={isInitializing}
            className="w-full bg-[var(--lilas-fonce)] text-white py-2 px-4 rounded-md hover:bg-[var(--lilas-clair)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInitializing ? 'Initialisation...' : 'Initialiser les bons de réduction'}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Bon utilisé</h2>
          <p className="text-gray-600 mb-4">
            Ajouter un bon de réduction déjà utilisé pour tester l&apos;historique.
          </p>
          <button
            onClick={handleAddUsedCoupon}
            disabled={isAddingUsed}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingUsed ? 'Ajout en cours...' : 'Ajouter un bon utilisé'}
          </button>
        </div>
      </div>
    </div>
  );
} 