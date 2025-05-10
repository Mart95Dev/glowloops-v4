'use client';

import { useState } from 'react';
import { useUserData } from '@/lib/hooks/use-user-data';
import { OrderSummary } from '@/components/account/order-summary';
import { ShoppingBag, Search, Filter } from 'lucide-react';

// Type d'onglet actif
type TabType = 'en-cours' | 'historique';

export default function OrdersPage() {
  const { loading, error, recentOrders } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<TabType>('en-cours');
  
  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700">
        <h2 className="text-lg font-medium mb-2">Erreur</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Séparation des commandes entre "En cours" et "Historique"
  const currentOrders = recentOrders.filter(order => 
    order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
  );
  
  const historyOrders = recentOrders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

  console.log("🔍 Toutes les commandes:", recentOrders.map(o => ({id: o.id, status: o.status, orderNumber: o.orderNumber})));
  console.log("🔍 Commandes en cours:", currentOrders.map(o => ({id: o.id, status: o.status, orderNumber: o.orderNumber})));
  console.log("🔍 Historique commandes:", historyOrders.map(o => ({id: o.id, status: o.status, orderNumber: o.orderNumber})));

  // Vérification explicite des statuts des commandes
  console.log("🧪 DIAGNOSTIC - Répartition des commandes par statut:");
  const statusCounts = {
    pending: recentOrders.filter(o => o.status === 'pending').length,
    processing: recentOrders.filter(o => o.status === 'processing').length,
    shipped: recentOrders.filter(o => o.status === 'shipped').length,
    delivered: recentOrders.filter(o => o.status === 'delivered').length,
    cancelled: recentOrders.filter(o => o.status === 'cancelled').length,
    total: recentOrders.length
  };
  console.log("📊 Répartition:", statusCounts);

  // Test temporaire : forcer l'affichage d'une commande dans l'historique
  // Regardez dans la console si cette commande apparaît pour diagnostiquer le problème
  if (recentOrders.length > 0 && historyOrders.length === 0) {
    // Test avec première commande (temporairement forcée en "delivered")
    const testOrder = {...recentOrders[0], status: 'delivered'};
    console.log("🧪 TEST - Commande forcée en 'delivered':", testOrder);
    console.log("🧪 TEST - Cette commande serait-elle dans l'historique:", 
      testOrder.status === 'delivered' || testOrder.status === 'cancelled');
  }

  // Filtrer les commandes en fonction de l'onglet actif et des filtres
  const ordersToDisplay = activeTab === 'en-cours' ? currentOrders : historyOrders;
  
  // Appliquer les filtres de recherche et de statut
  const filteredOrders = ordersToDisplay.filter((order) => {
    const matchesSearch = searchQuery 
      ? order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== 'all' 
      ? order.status === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <>
      <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce mb-6">
        Mes commandes
      </h1>
      
      {/* Onglets de commandes */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${
            activeTab === 'en-cours'
              ? 'border-lilas-fonce text-lilas-fonce'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('en-cours')}
        >
          Commandes en cours ({currentOrders.length})
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${
            activeTab === 'historique'
              ? 'border-lilas-fonce text-lilas-fonce'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('historique')}
        >
          Historique ({historyOrders.length})
        </button>
      </div>
      
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {activeTab === 'en-cours' ? (
              <>
                <option value="pending">En attente</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée</option>
              </>
            ) : (
              <>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Liste des commandes */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderSummary key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-300 mb-4">
            <ShoppingBag className="w-12 h-12 mx-auto" />
          </div>
          {searchQuery || statusFilter !== 'all' ? (
            <>
              <h3 className="text-gray-700 font-medium mb-1">Aucune commande trouvée</h3>
              <p className="text-gray-500 text-sm mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </>
          ) : (
            <>
              <h3 className="text-gray-700 font-medium mb-1">
                {activeTab === 'en-cours' 
                  ? "Pas de commandes en cours" 
                  : "Pas d'historique de commandes"}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {activeTab === 'en-cours'
                  ? "Vous n'avez pas de commandes en cours actuellement"
                  : "Votre historique de commandes est vide"}
              </p>
              {activeTab === 'historique' && historyOrders.length === 0 && currentOrders.length > 0 && (
                <button
                  onClick={() => setActiveTab('en-cours')}
                  className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
                >
                  Voir mes commandes en cours
                </button>
              )}
              {currentOrders.length === 0 && historyOrders.length === 0 && (
                <a
                  href="/shop"
                  className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
                >
                  Explorer la boutique
                </a>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
} 