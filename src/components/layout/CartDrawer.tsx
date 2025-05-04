"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '../ui/Button';


const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateItemQuantity, subtotal } = useCartStore();

  // Si le panier n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
      >
        {/* Entête */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-playfair">Votre panier</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer le panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 mb-4"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p className="text-gray-500 mb-4">Votre panier est vide</p>
              <Button onClick={closeCart} variant="default">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 py-3 border-b"
                  >
                    {/* Image du produit */}
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Informations du produit */}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.color && (
                        <p className="text-sm text-gray-500">Couleur: {item.color}</p>
                      )}
                      {item.garantie && (
                        <p className="text-sm text-gray-500">
                          Garantie: {item.garantie.name} (+{item.garantie.price.toFixed(2)}€)
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="Diminuer la quantité"
                          >
                            -
                          </button>
                          <span className="px-2 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    {/* Bouton de suppression */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Supprimer l'article"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Pied de page avec total et bouton de paiement */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-2">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-500">
              <span>Livraison</span>
              <span>Calculée à l&apos;étape suivante</span>
            </div>
            <Link href="/panier" onClick={closeCart}>
              <Button fullWidth={true} className="mb-2">
                Voir mon panier
              </Button>
            </Link>
            <Link href="/paiement" onClick={closeCart}>
              <Button fullWidth={true} variant="secondary">
                Passer au paiement
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartDrawer;
