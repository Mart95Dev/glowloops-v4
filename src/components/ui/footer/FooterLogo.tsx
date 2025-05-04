"use client";

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

interface FooterLogoProps {
  slogan: string;
}

const FooterLogo: React.FC<FooterLogoProps> = ({ slogan }) => {
  return (
    <div className="md:col-span-1">
      <Link href="/" className="inline-block mb-4" aria-label="GlowLoops - Accueil">
        <div className="flex items-center">
          <span className="text-xl font-bold font-display">
            <span className="text-lilas-fonce">Glow</span>
            <span>Loops</span>
          </span>
        </div>
      </Link>
      <p className="text-sm text-gray-600 mb-6">{slogan}</p>
      <div className="flex space-x-4 mb-6">
        <Link href="https://instagram.com/glowloops" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-lilas-clair transition-colors">
            <FaInstagram className="text-gray-800 text-lg" />
          </div>
        </Link>
        <Link href="https://tiktok.com/@glowloops" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur TikTok">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-lilas-clair transition-colors">
            <FaTiktok className="text-gray-800 text-lg" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterLogo;
