'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { FavoriteToggle } from '@/components/account/favorite-toggle';
import { useAuth } from '@/lib/firebase/auth';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';

interface PageProps {
  params: {
    slug: string;
  };
}

interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  isAvailable: boolean;
}

interface PublicWishlist {
  userId: string;
  title: string;
  slug: string;
  message?: string;
  theme: 'classic' | 'modern' | 'elegant' | 'festive' | 'minimal';
  products: WishlistProduct[];
  ownerName: string;
}

export default function PublicWishlistPage({ params }: PageProps) {
  const { slug } = params;
  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        
        // Rechercher la wishlist par son slug
        const wishlistsQuery = query(
          collection(db, 'wishlists'),
          where('slug', '==', slug),
          where('isPublic', '==', true)
        );
        
        const wishlistsSnapshot = await getDocs(wishlistsQuery);
        
        if (wishlistsSnapshot.empty) {
          setError('Wishlist introuvable ou privée');
          setLoading(false);
          return;
        }
        
        // Récupérer les données de la wishlist
        const wishlistDoc = wishlistsSnapshot.docs[0];
        const wishlistData = wishlistDoc.data();
        const products: WishlistProduct[] = [];
        
        // Récupérer le nom du propriétaire
        const userDoc = await getDoc(doc(db, 'users', wishlistDoc.id));
        let ownerName = 'Utilisateur';
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          ownerName = userData.displayName || userData.firstName || 'Utilisateur';
        }
        
        // Récupérer les produits de la wishlist
        if (wishlistDoc.id) {
          const userFavoritesRef = doc(db, 'userFavorites', wishlistDoc.id);
          const favoritesSnapshot = await getDoc(userFavoritesRef);
          
          if (favoritesSnapshot.exists()) {
            const favoriteItems = favoritesSnapshot.data().items || [];
            
            // Récupérer les détails des produits
            for (const item of favoriteItems) {
              try {
                const productRef = doc(db, 'products', item.id);
                const productSnapshot = await getDoc(productRef);
                
                if (productSnapshot.exists()) {
                  const productData = productSnapshot.data();
                  
                  products.push({
                    id: item.id,
                    name: productData.basic_info?.name || item.nom,
                    price: productData.pricing?.regular_price || item.prix,
                    imageUrl: productData.media?.mainImageUrl || item.image,
                    slug: productData.basic_info?.slug || item.id,
                    isAvailable: (productData.inventory?.quantity > 0) || true
                  });
                } else {
                  // Ajouter quand même avec les données minimales de favori
                  products.push({
                    id: item.id,
                    name: item.nom,
                    price: item.prix,
                    imageUrl: item.image,
                    slug: item.id,
                    isAvailable: true
                  });
                }
              } catch (error) {
                console.error(`Erreur lors de la récupération du produit ${item.id}:`, error);
              }
            }
          }
        }
        
        // Construire l'objet wishlist
        setWishlist({
          userId: wishlistDoc.id,
          title: wishlistData.title || 'Wishlist',
          slug: wishlistData.slug,
          message: wishlistData.message,
          theme: wishlistData.theme || 'classic',
          products,
          ownerName
        });
        
      } catch (error) {
        console.error('Erreur lors de la récupération de la wishlist:', error);
        setError('Une erreur est survenue lors du chargement de la wishlist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [slug]);
  
  const handleAddToCart = (product: WishlistProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl
    });
    
    toast.success(`${product.name} ajouté au panier`);
  };
  
  // Styles en fonction du thème
  const themeStyles = {
    classic: 'bg-white text-gray-900',
    modern: 'bg-gray-50 text-gray-900',
    elegant: 'bg-lilas-clair/5 text-gray-900',
    festive: 'bg-menthe/5 text-gray-900',
    minimal: 'bg-white text-gray-900'
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <Loader2 className="w-10 h-10 text-lilas-fonce animate-spin mb-4" />
        <p className="text-gray-600">Chargement de la wishlist...</p>
      </div>
    );
  }
  
  if (error || !wishlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4">
        <div className="text-center max-w-lg">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Wishlist non disponible</h1>
          <p className="text-gray-600 mb-8">{error || 'Cette wishlist n\'existe pas ou n\'est pas publique.'}</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-lilas-fonce text-white rounded-full hover:bg-lilas-clair transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${themeStyles[wishlist.theme]} pb-20`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">{wishlist.title}</h1>
          
          {wishlist.message && (
            <p className="text-gray-600 mb-4 max-w-xl mx-auto">{wishlist.message}</p>
          )}
          
          <p className="text-sm text-gray-500 mt-4">
            Wishlist partagée par {wishlist.ownerName}
          </p>
        </motion.div>

        {wishlist.products.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Cette wishlist est vide</h2>
            <p className="text-gray-500">Aucun produit n&apos;a été ajouté à cette wishlist pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="relative">
                  <Link href={`/produits/${product.slug}`} className="block relative h-60 w-full">
                    <Image
                      src={product.imageUrl || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </Link>
                  
                  {user && user.uid !== wishlist.userId && (
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteToggle
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.imageUrl}
                        size="md"
                        color="lilas"
                      />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <Link href={`/produits/${product.slug}`} className="block">
                    <h3 className="text-lg font-medium text-gray-800 hover:text-lilas-fonce transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-lilas-fonce font-semibold mb-3">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {product.isAvailable ? 'En stock' : 'Indisponible'}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isAvailable}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                        product.isAvailable 
                          ? 'bg-lilas-fonce text-white hover:bg-lilas-clair' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="px-6 py-3 bg-lilas-fonce text-white rounded-full hover:bg-lilas-clair transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Découvrir tous nos produits
          </Link>
        </div>
      </div>
    </div>
  );
} 