"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export interface CategoryFeature {
  icon: string;
  title: string;
  description: string;
}

interface CategoryFeaturesProps {
  features: CategoryFeature[];
  categoryType: 'style' | 'vibe' | 'material';
}

export default function CategoryFeatures({ features, categoryType }: CategoryFeaturesProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getBackgroundColor = () => {
    switch (categoryType) {
      case 'style':
        return 'bg-lilas-clair/10';
      case 'vibe':
        return 'bg-dore/10';
      case 'material':
        return 'bg-menthe/10';
      default:
        return 'bg-lilas-clair/10';
    }
  };

  const getIconColor = () => {
    switch (categoryType) {
      case 'style':
        return 'text-lilas-fonce';
      case 'vibe':
        return 'text-dore';
      case 'material':
        return 'text-menthe';
      default:
        return 'text-lilas-fonce';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-center mb-8">
        Pourquoi choisir {categoryType === 'style' ? 'ce style' : categoryType === 'vibe' ? 'cette vibe' : 'ce matériau'} ?
      </h2>
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`p-4 rounded-lg ${getBackgroundColor()} flex flex-col items-center text-center`}
          >
            <div className={`text-3xl mb-3 ${getIconColor()}`}>
              {feature.icon}
            </div>
            <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 