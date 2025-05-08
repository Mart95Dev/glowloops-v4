'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  sideContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  sideContent
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-lilas-clair/20 to-creme-nude/30">
      {/* Header avec logo */}
      <header className="w-full py-4 px-4 flex justify-center">
        <Link href="/" className="inline-block">
          <Image 
            src="/images/logo-glowloops.png" 
            alt="GlowLoops" 
            width={180} 
            height={50}
            className="w-auto h-10 md:h-12"
          />
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <motion.div 
          className={`w-full ${sideContent ? 'max-w-4xl' : 'max-w-md'} bg-white rounded-xl shadow-md overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {sideContent ? (
            <div className="flex flex-col md:flex-row">
              {/* Formulaire principal */}
              <div className="p-6 md:p-8 md:w-1/2 md:border-r border-gray-100">
                {/* En-tête du formulaire */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-playfair font-semibold text-lilas-fonce mb-2">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-gray-500 text-sm">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Contenu du formulaire */}
                <div className="space-y-4">
                  {children}
                </div>
              </div>

              {/* Contenu latéral */}
              <div className="p-6 md:p-8 md:w-1/2 bg-gray-50 flex items-center">
                {sideContent}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              {/* En-tête du formulaire */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-playfair font-semibold text-lilas-fonce mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-500 text-sm">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Contenu */}
              <div className="space-y-4">
                {children}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} GlowLoops. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AuthLayout; 