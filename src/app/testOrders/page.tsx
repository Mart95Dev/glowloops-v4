'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/types/order';
import { getUserOrders } from '@/lib/services/order-service';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth';
import LoginForm from '@/components/auth/LoginForm';

export default function TestOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchUserOrders() {
      try {
        setLoading(true);
        // Utiliser l'UID de l'utilisateur connecté
        const userId = user?.uid;
        if (!userId) return;
        const fetchedOrders = await getUserOrders(userId);
        setOrders(fetchedOrders);
      } catch {
        setError("Impossible de récupérer les commandes. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user]);

  if (authLoading) {
    return <div>Chargement de l&apos;authentification...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-40">
        <h2 className="text-xl font-bold mb-4">Connexion requise</h2>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-40">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Commandes de l&apos;utilisateur {user.email}</h1>
        <Link href="/testOrders/ajouter">
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            + Ajouter une commande test
          </button>
        </Link>
      </div>
      {loading ? (
        <div>Chargement des commandes...</div>
      ) : error ? (
        <div>Erreur: {error}</div>
      ) : orders.length === 0 ? (
        <div>
          <p>Aucune commande trouvée pour cet utilisateur.</p>
          <p style={{ marginTop: '10px' }}>Créez une commande test en cliquant sur le bouton ci-dessus.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: '20px' }}>
            <h2>Commande #{order.id}</h2>
            <p>Date: {order.orderDate.toLocaleDateString('fr-FR')}</p>
            <p>Statut: {order.status}</p>
            <p>Total: {order.total.toFixed(2)}€</p>
            <h3>Articles</h3>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.productName} - Quantité: {item.quantity} - Prix: {item.price.toFixed(2)}€ - Sous-total: {item.subtotal.toFixed(2)}€
                </li>
              ))}
            </ul>
            <h3>Adresse de livraison</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>{order.shippingAddress.postalCode}, {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phoneNumber && <p>Tél: {order.shippingAddress.phoneNumber}</p>}
            <h3>Méthode de paiement</h3>
            <p>Type: {order.paymentMethod.type}</p>
            <p>Statut: {order.paymentMethod.status}</p>
            {order.paymentMethod.transactionId && <p>ID de transaction: {order.paymentMethod.transactionId}</p>}
          </div>
        ))
      )}
    </div>
  );
} 