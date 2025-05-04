"use client";

import React from 'react';
import Link from 'next/link';

const HelpSection: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800">Aide</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/faq" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/livraison-retours" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Livraison & Retours
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/guide-des-tailles" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Guide des tailles
          </Link>
        </li>
        <li>
          <Link href="/entretien-des-bijoux" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Entretien des bijoux
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HelpSection;
