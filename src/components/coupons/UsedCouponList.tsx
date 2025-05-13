'use client';

import { useCouponStore } from '@/lib/store/coupon-store';
import { formatDate } from '@/lib/utils/date-utils';
import { motion } from 'framer-motion';
import { Clock, Tag, ShoppingBag } from 'lucide-react';

export const UsedCouponList = () => {
  const { usedCoupons } = useCouponStore();

  if (usedCoupons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 border border-gray-200 rounded-md p-6 my-4 text-center"
      >
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">Aucun bon utilisé</h3>
        <p className="text-sm text-gray-500">
          Vous n&apos;avez pas encore utilisé de bons de réduction.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {usedCoupons.map((coupon) => (
        <motion.div
          key={coupon.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{coupon.description}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Tag className="h-4 w-4 mr-1" />
                <span className="font-mono">{coupon.code}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-700">
                {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}€`}
              </div>
              <div className="text-xs text-gray-500">
                Utilisé le {formatDate(coupon.usedAt)}
              </div>
            </div>
          </div>
          
          {coupon.orderIdUsed && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center text-sm text-gray-600">
              <ShoppingBag className="h-4 w-4 mr-1" />
              <span>Commande: {coupon.orderIdUsed}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}; 