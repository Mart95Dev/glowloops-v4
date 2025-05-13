'use client';

import { useState } from 'react';
import { CouponList } from '@/components/coupons/CouponList';
import { UsedCouponList } from '@/components/coupons/UsedCouponList';
import { CouponAlert } from '@/components/coupons/CouponAlert';
import { useCouponStore } from '@/lib/store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { motion } from 'framer-motion';
import { Ticket, History, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const { coupons } = useCouponStore();

  const handleCopyCode = (code: string) => {
    // Logique supplémentaire après copie du code si nécessaire
    console.log(`Code copié: ${code}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes bons de réduction</h1>
          <p className="text-gray-600">
            Gérez vos bons de réduction et consultez leur historique.
          </p>
        </div>
        <Link 
          href="/mon-compte/coupons/init"
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Initialiser des bons
        </Link>
      </div>

      {/* Alerte pour les bons qui expirent bientôt */}
      <CouponAlert coupons={coupons} />

      {/* Tabs pour alterner entre les bons actifs et l'historique */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="flex items-center">
            <Ticket className="h-4 w-4 mr-2" />
            Bons actifs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <CouponList onCopyCode={handleCopyCode} />
        </TabsContent>
        <TabsContent value="history">
          <UsedCouponList />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
} 