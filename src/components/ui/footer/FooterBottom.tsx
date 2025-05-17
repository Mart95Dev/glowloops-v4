"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FooterBottom: React.FC = () => {
  return (
    <div className="border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} GlowLoops. Tous droits réservés.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <Image 
              src="/payment/payment.png" 
              alt="Méthodes de paiement acceptées : Visa, Mastercard, PayPal"
              width={200}
              height={40}
              className="h-6 md:h-8 w-auto" 
            />
          </div>
          <div className="flex gap-4">
            <Link href="/accessibilite" className="text-gray-500 hover:text-lilas-fonce transition-colors">
              Accessibilité
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-lilas-fonce transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
