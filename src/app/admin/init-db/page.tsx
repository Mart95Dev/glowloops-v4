'use client';

import { useState, useEffect } from 'react';
import { initializeFavoriteField } from '@/lib/firebase/init-favorite-field';
import { addTestFavorite } from '@/lib/firebase/add-test-favorite';
import { getProductsList, ProductListItem } from '@/lib/firebase/get-products-list';
import { db } from '@/lib/firebase/firebase-config';
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function InitDbPage() {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [testMessage, setTestMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addingSpecificProduct, setAddingSpecificProduct] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté et est un administrateur
  useEffect(() => {
    if (!authLoading && !user) {
      // Rediriger vers la page de connexion si non connecté
      router.push('/connexion');
    }
    // Ici on pourrait aussi vérifier si l'utilisateur a le rôle admin
  }, [authLoading, user, router]);

  // Charger la liste des produits disponibles
  useEffect(() => {
    async function loadProducts() {
      if (!user) return; // Ne pas charger si l'utilisateur n'est pas connecté
      
      setProductsLoading(true);
      try {
        const productsList = await getProductsList(20);
        setProducts(productsList);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setProductsLoading(false);
      }
    }
    
    if (!authLoading) {
      loadProducts();
    }
  }, [authLoading, user]);

  const handleInitFavorites = async () => {
    if (!user) {
      setMessage({ text: 'Vous devez être connecté pour effectuer cette action', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: 'Initialisation du champ favoriteProductIds en cours...', type: 'info' });
    
    try {
      await initializeFavoriteField();
      setMessage({ text: 'Initialisation terminée avec succès !', type: 'success' });
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        text: `Erreur lors de l'initialisation: ${(error as Error).message || 'Erreur inconnue'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestFavorite = async () => {
    if (!user) {
      setTestMessage({ text: 'Vous devez être connecté pour effectuer cette action', type: 'error' });
      return;
    }
    
    setTestLoading(true);
    setTestMessage({ text: 'Ajout du produit test aux favoris d\'Alice...', type: 'info' });
    
    try {
      const result = await addTestFavorite();
      if (result) {
        setTestMessage({ text: 'Produit test ajouté aux favoris d\'Alice avec succès !', type: 'success' });
      } else {
        setTestMessage({ text: 'Échec lors de l\'ajout du produit test.', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setTestMessage({ 
        text: `Erreur: ${(error as Error).message || 'Erreur inconnue'}`, 
        type: 'error' 
      });
    } finally {
      setTestLoading(false);
    }
  };

  // Ajouter un produit spécifique aux favoris d'Alice
  const handleAddSpecificProduct = async () => {
    if (!user) {
      setTestMessage({ text: 'Vous devez être connecté pour effectuer cette action', type: 'error' });
      return;
    }
    
    if (!selectedProductId) {
      setTestMessage({ text: 'Veuillez sélectionner un produit', type: 'error' });
      return;
    }
    
    setAddingSpecificProduct(true);
    setTestMessage({ text: `Ajout du produit ${selectedProductId} aux favoris d'Alice...`, type: 'info' });
    
    try {
      // Rechercher l'utilisateur Alice
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', 'alice.martin@example.com')
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        throw new Error("Utilisateur Alice non trouvé");
      }
      
      const userDoc = usersSnapshot.docs[0];
      
      // Ajouter le produit sélectionné aux favoris
      await updateDoc(doc(db, 'users', userDoc.id), {
        favoriteProductIds: arrayUnion(selectedProductId)
      });
      
      setTestMessage({ 
        text: `Produit ${selectedProductId} ajouté aux favoris d'Alice avec succès !`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Erreur:', error);
      setTestMessage({ 
        text: `Erreur: ${(error as Error).message || 'Erreur inconnue'}`, 
        type: 'error' 
      });
    } finally {
      setAddingSpecificProduct(false);
    }
  };

  // Afficher un message de chargement si l'authentification est en cours
  if (authLoading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p className="text-lg">Chargement en cours...</p>
      </div>
    );
  }

  // Afficher un message si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-playfair text-lilas-fonce mb-4">Accès restreint</h1>
        <p className="mb-6">Vous devez être connecté avec un compte administrateur pour accéder à cette page.</p>
        <button
          onClick={() => router.push('/connexion')}
          className="px-6 py-2 bg-lilas-fonce text-white rounded-lg hover:bg-lilas-clair"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-playfair text-lilas-fonce mb-6">Initialisation de la base de données</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Initialisation des favoris</h2>
        <p className="mb-4 text-gray-600">
          Cette opération va ajouter le champ <code className="bg-gray-100 px-1 py-0.5 rounded">favoriteProductIds</code> à 
          tous les documents utilisateur qui ne l&apos;ont pas encore.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleInitFavorites}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-lilas-fonce hover:bg-lilas-clair text-white'
            }`}
          >
            {loading ? 'Initialisation...' : 'Initialiser les favoris'}
          </button>
          
          {message && (
            <div className={`rounded-lg px-4 py-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Ajouter un produit test aux favoris</h2>
        <p className="mb-4 text-gray-600">
          Cette opération va ajouter un produit test aux favoris de l&apos;utilisateur Alice.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleAddTestFavorite}
            disabled={testLoading}
            className={`px-4 py-2 rounded-lg ${
              testLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-lilas-fonce hover:bg-lilas-clair text-white'
            }`}
          >
            {testLoading ? 'Ajout en cours...' : 'Ajouter un produit test'}
          </button>
          
          {testMessage && (
            <div className={`rounded-lg px-4 py-2 ${
              testMessage.type === 'success' ? 'bg-green-100 text-green-800' :
              testMessage.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {testMessage.text}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Ajouter un produit spécifique aux favoris</h2>
        <p className="mb-4 text-gray-600">
          Sélectionnez un produit spécifique à ajouter aux favoris d&apos;Alice.
        </p>
        
        <div className="mb-4">
          <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Produit
          </label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-lilas-clair focus:border-lilas-clair"
            disabled={productsLoading}
          >
            <option value="">Sélectionner un produit</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (ID: {product.id})
              </option>
            ))}
          </select>
          {productsLoading && (
            <p className="mt-1 text-sm text-gray-500">Chargement des produits...</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleAddSpecificProduct}
            disabled={addingSpecificProduct || !selectedProductId}
            className={`px-4 py-2 rounded-lg ${
              addingSpecificProduct || !selectedProductId
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-lilas-fonce hover:bg-lilas-clair text-white'
            }`}
          >
            {addingSpecificProduct ? 'Ajout en cours...' : 'Ajouter aux favoris'}
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Attention : Cette page est réservée aux administrateurs. Ces opérations modifient la structure de la base de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 