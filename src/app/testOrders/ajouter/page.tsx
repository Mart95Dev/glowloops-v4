'use client';

import { useState } from 'react';
import { addTestOrderForUser } from '@/lib/services/test-order-service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';

export default function AjouterCommandeTest() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  async function handleAddTestOrder() {
    if (!user) {
      setError("Vous devez être connecté pour créer une commande test.");
      return;
    }
    try {
      setLoading(true);
      setSuccess(null);
      setError(null);
      // Ajouter une commande de test pour l'utilisateur connecté
      const id = await addTestOrderForUser(user);
      setOrderId(id);
      setSuccess(true);
    } catch (error) {
      console.error("Échec de l'ajout de la commande test:", error);
      setSuccess(false);
      setError("Erreur lors de la création de la commande test.");
    } finally {
      setLoading(false);
    }
  }

  function handleViewOrders() {
    router.push('/testOrders');
  }

  return (
    <div className="p-4">
      <h1>Ajouter une commande de test</h1>
      <div className="my-4">
        <button 
          onClick={handleAddTestOrder}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '8px'
          }}
        >
          {loading ? 'Ajout en cours...' : 'Ajouter une commande test pour cet utilisateur'}
        </button>
        <button 
          onClick={handleViewOrders}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Voir les commandes
        </button>
      </div>
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b',
          padding: '12px',
          borderRadius: '4px',
          marginTop: '12px'
        }}>
          <p>{error}</p>
        </div>
      )}
      {loading && <p>Création de la commande en cours...</p>}
      {success === true && (
        <div style={{ 
          backgroundColor: '#dcfce7', 
          color: '#166534',
          padding: '12px',
          borderRadius: '4px',
          marginTop: '12px'
        }}>
          <p>Commande créée avec succès!</p>
          <p>ID de la commande: {orderId}</p>
        </div>
      )}
      {success === false && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b',
          padding: '12px',
          borderRadius: '4px',
          marginTop: '12px'
        }}>
          <p>Échec de la création de la commande. Veuillez vérifier la console pour plus de détails.</p>
        </div>
      )}
      <div style={{ marginTop: '24px' }}>
        <h2>Informations sur la commande de test</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Utilisateur: {user?.email ?? 'Non connecté'}</li>
          <li>Produits: 
            <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '4px' }}>
              <li>Bague en résine - Fleur enchantée (29.99€)</li>
              <li>Collier pendentif - Étoile dorée (39.99€ x 2)</li>
            </ul>
          </li>
          <li>Sous-total: 109.97€</li>
          <li>Frais de livraison: 4.99€</li>
          <li>Taxe: 23.09€</li>
          <li>Remise: 10.00€</li>
          <li>Total: 128.05€</li>
          <li>Statut: En cours de traitement</li>
        </ul>
      </div>
    </div>
  );
} 