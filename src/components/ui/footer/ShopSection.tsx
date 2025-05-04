"use client";

import React from 'react';
import Link from 'next/link';

const ShopSection: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800">Boutique</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/nouveautes" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Nouveautes
          </Link>
        </li>
        <li>
          <Link href="/paris" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Paris
          </Link>
        </li>
        <li>
          <Link href="/promotions" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Promotions
          </Link>
        </li>
        <li>
          <Link href="/carte-cadeau" className="text-gray-600 hover:text-lilas-fonce transition-colors">
            Carte cadeau
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ShopSection;
