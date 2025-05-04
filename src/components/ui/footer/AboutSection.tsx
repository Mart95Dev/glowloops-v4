"use client";

import React from 'react';
import Link from 'next/link';

const AboutSection: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800">A propos</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/notre-histoire" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Notre histoire
          </Link>
        </li>
        <li>
          <Link href="/avis-clients" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Avis clients
          </Link>
        </li>
        <li>
          <Link href="/cgv" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            CGV
          </Link>
        </li>
        <li>
          <Link href="/politique-de-confidentialite" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Politique de confidentialite
          </Link>
        </li>
        <li>
          <Link href="/mentions-legales" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Mentions legales
          </Link>
        </li>
        <li>
          <button 
            onClick={() => {}}
            className="text-gray-600 hover:text-lilas-fonce transition-colors"
          >
            Parametres des cookies
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AboutSection;
