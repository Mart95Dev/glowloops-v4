'use client';

import { motion } from 'framer-motion';

interface Advantage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AdvantagesBannerProps {
  advantages: Advantage[];
}

export const AdvantagesBanner = ({ advantages }: AdvantagesBannerProps) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="bg-gradient-to-r from-[var(--lilas-clair)] to-[var(--lilas-fonce)] py-12 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {advantages.map((advantage) => (
            <motion.div 
              key={advantage.id}
              className="flex flex-col items-center rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                {advantage.icon}
              </div>
              <h3 className="mb-2 font-playfair text-xl font-semibold">{advantage.title}</h3>
              <p className="text-white/90">{advantage.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
