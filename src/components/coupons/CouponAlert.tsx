'use client';

import { Coupon } from '@/lib/types/coupon';
import { formatRelativeDate, isNearExpiry } from '@/lib/utils/date-utils';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CouponAlertProps {
  coupons: Coupon[];
  daysThreshold?: number;
}

export const CouponAlert = ({ coupons, daysThreshold = 7 }: CouponAlertProps) => {
  // Filtrer les coupons qui expirent bientôt
  const expiringCoupons = coupons.filter((coupon) => 
    isNearExpiry(coupon.expiryDate, daysThreshold)
  );

  if (expiringCoupons.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6"
    >
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-amber-800">
            Bons de réduction qui expirent bientôt
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <ul className="list-disc pl-5 space-y-1">
              {expiringCoupons.map((coupon) => (
                <li key={coupon.id}>
                  <span className="font-medium">{coupon.description}</span> - 
                  {coupon.type === 'percentage' ? ` ${coupon.value}%` : ` ${coupon.value}€`} de réduction, 
                  expire <span className="font-medium">{formatRelativeDate(coupon.expiryDate)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 