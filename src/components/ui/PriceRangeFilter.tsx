"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (values: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function PriceRangeFilter({
  min,
  max,
  value,
  step = 1,
  onChange,
  formatLabel = (value) => `${value}`,
  className = ""
}: PriceRangeFilterProps) {
  const [localValues, setLocalValues] = useState<[number, number]>(value);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Mise à jour des valeurs locales lorsque les props changent
  useEffect(() => {
    setLocalValues(value);
  }, [value]);

  // Calcul du pourcentage pour positionner les curseurs
  const getPercent = (value: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  // Position des curseurs en pourcentage
  const minPos = getPercent(localValues[0]);
  const maxPos = getPercent(localValues[1]);

  // Gestion du changement de valeur via les inputs numériques
  const handleInputChange = (index: 0 | 1, newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    
    // Empêcher le croisement des valeurs
    if (index === 0 && clampedValue > localValues[1]) {
      return;
    }
    if (index === 1 && clampedValue < localValues[0]) {
      return;
    }
    
    const newValues: [number, number] = [...localValues] as [number, number];
    newValues[index] = clampedValue;
    
    setLocalValues(newValues);
    onChange(newValues);
  };

  // Gestion du clic sur la piste
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const rawValue = min + percent * (max - min);
    const value = Math.round(rawValue / step) * step;
    
    // Déterminer quel curseur déplacer en fonction de la proximité
    const distToMin = Math.abs(value - localValues[0]);
    const distToMax = Math.abs(value - localValues[1]);
    
    if (distToMin <= distToMax) {
      handleInputChange(0, value);
    } else {
      handleInputChange(1, value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray-700">
          {formatLabel(localValues[0])}
        </div>
        <div className="text-sm text-gray-700">
          {formatLabel(localValues[1])}
        </div>
      </div>
      
      <div className="relative py-4">
        {/* Piste du slider */}
        <div 
          ref={trackRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Partie colorée entre les deux curseurs */}
          <div 
            className="absolute h-full bg-lilas-fonce rounded-full"
            style={{
              left: `${minPos}%`,
              width: `${maxPos - minPos}%`
            }}
          />
        </div>
        
        {/* Curseurs */}
        <div className="relative">
          {/* Curseur minimum */}
          <div 
            className="absolute top-0 -mt-3"
            style={{ left: `calc(${minPos}% - 10px)` }}
          >
            <motion.div
              className="w-5 h-5 bg-white border-2 border-lilas-fonce rounded-full cursor-grab shadow-md"
              whileTap={{ scale: 1.1, cursor: 'grabbing' }}
              drag="x"
              dragConstraints={trackRef}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                if (!trackRef.current) return;
                
                const rect = trackRef.current.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));
                const rawValue = min + percent * (max - min);
                const value = Math.max(min, Math.min(localValues[1] - step, Math.round(rawValue / step) * step));
                
                handleInputChange(0, value);
              }}
            />
          </div>
          
          {/* Curseur maximum */}
          <div 
            className="absolute top-0 -mt-3"
            style={{ left: `calc(${maxPos}% - 10px)` }}
          >
            <motion.div
              className="w-5 h-5 bg-white border-2 border-lilas-fonce rounded-full cursor-grab shadow-md"
              whileTap={{ scale: 1.1, cursor: 'grabbing' }}
              drag="x"
              dragConstraints={trackRef}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                if (!trackRef.current) return;
                
                const rect = trackRef.current.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));
                const rawValue = min + percent * (max - min);
                const value = Math.min(max, Math.max(localValues[0] + step, Math.round(rawValue / step) * step));
                
                handleInputChange(1, value);
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Inputs numériques pour saisie directe */}
      <div className="flex justify-between mt-2 gap-2">
        <div className="flex-1">
          <input
            type="number"
            min={min}
            max={localValues[1] - step}
            step={step}
            value={localValues[0]}
            onChange={(e) => handleInputChange(0, Number(e.target.value))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-lilas-fonce focus:border-lilas-fonce"
          />
        </div>
        <span className="text-gray-500 self-center">-</span>
        <div className="flex-1">
          <input
            type="number"
            min={localValues[0] + step}
            max={max}
            step={step}
            value={localValues[1]}
            onChange={(e) => handleInputChange(1, Number(e.target.value))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-lilas-fonce focus:border-lilas-fonce"
          />
        </div>
      </div>
    </div>
  );
}
