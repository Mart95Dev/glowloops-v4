"use client";

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  message: string;
  className?: string;
}

const PromoCountdown: React.FC<CountdownProps> = ({ targetDate, message, className }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    };

    // Calculer le temps restant immédiatement
    setTimeLeft(calculateTimeLeft());
    
    // Mettre à jour le compte à rebours toutes les secondes
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(timer);
  }, [targetDate]);

  // Formater les nombres pour qu'ils aient toujours deux chiffres
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className={`text-center ${className}`}>
      <p className="mb-2">{message}</p>
      <div className="flex justify-center space-x-3 text-sm">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{formatNumber(timeLeft.days)}</span>
          <span className="text-xs">jours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{formatNumber(timeLeft.hours)}</span>
          <span className="text-xs">heures</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-xs">min</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-xs">sec</span>
        </div>
      </div>
    </div>
  );
};

export default PromoCountdown;
