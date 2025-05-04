"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour gérer l'inscription à la newsletter
    // À implémenter avec Firebase
  };

  return (
    <footer className="bg-lilas-clair pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Section newsletter */}
        <div className="max-w-xl mx-auto mb-12 text-center">
          <h3 className="text-2xl font-playfair mb-4">Rejoignez la communauté GlowLoops</h3>
          <p className="text-gray-600 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir des offres exclusives, 
            des conseils de style et être informé(e) des nouveautés en avant-première.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Votre adresse email"
              required
              className="flex-grow"
            />
            <Button type="submit">S&apos;inscrire</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo.png" 
                alt="GlowLoops" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              Des bijoux fantaisie tendance et accessoires pour sublimer votre style au quotidien.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </SocialLink>
              <SocialLink href="https://facebook.com" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </SocialLink>
              <SocialLink href="https://pinterest.com" aria-label="Pinterest">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                  <path d="M21 12c0 4.418 -4.03 8 -9 8a9.863 9.863 0 0 1 -4.255 -.949l-3.745 .976l1.148 -3.71a7.569 7.569 0 0 1 -1.148 -3.993c0 -4.418 4.03 -8 9 -8s9 3.582 9 8z"></path>
                </svg>
              </SocialLink>
              <SocialLink href="https://tiktok.com" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Collections</h4>
            <ul className="space-y-2">
              <FooterLink href="/collections/nouveautes">Nouveautés</FooterLink>
              <FooterLink href="/collections/bijoux">Bijoux</FooterLink>
              <FooterLink href="/collections/accessoires">Accessoires</FooterLink>
              <FooterLink href="/collections/best-sellers">Best-sellers</FooterLink>
              <FooterLink href="/collections/promos">Promotions</FooterLink>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Informations</h4>
            <ul className="space-y-2">
              <FooterLink href="/a-propos">À propos</FooterLink>
              <FooterLink href="/livraison">Livraison & Retours</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Légal</h4>
            <ul className="space-y-2">
              <FooterLink href="/cgv">Conditions générales de vente</FooterLink>
              <FooterLink href="/confidentialite">Politique de confidentialité</FooterLink>
              <FooterLink href="/cookies">Gestion des cookies</FooterLink>
              <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
            </ul>
          </div>
        </div>

        {/* Moyens de paiement */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} GlowLoops. Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-4">
              <Image src="/payment/visa.svg" alt="Visa" width={40} height={24} />
              <Image src="/payment/mastercard.svg" alt="Mastercard" width={40} height={24} />
              <Image src="/payment/paypal.svg" alt="PayPal" width={40} height={24} />
              <Image src="/payment/apple-pay.svg" alt="Apple Pay" width={40} height={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Composant pour les liens du footer
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <Link 
        href={href} 
        className="text-gray-600 hover:text-lilas-fonce transition-colors"
      >
        {children}
      </Link>
    </li>
  );
};

// Composant pour les liens sociaux
interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
  'aria-label': string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, children, ...props }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-lilas-fonce transition-colors"
      {...props}
    >
      {children}
    </a>
  );
};

export default Footer;
