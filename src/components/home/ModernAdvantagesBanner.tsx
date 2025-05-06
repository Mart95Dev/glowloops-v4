"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface Advantage {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface ModernAdvantagesBannerProps {
  advantages: Advantage[];
}

export default function ModernAdvantagesBanner({ advantages }: ModernAdvantagesBannerProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section 
      ref={ref} 
      className="min-w-[375px] py-12 md:py-16 px-4 bg-white border-t border-gray-100 text-gray-800"
    >
      <div className="container mx-auto ">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
            Pourquoi choisir GlowLoops ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des boucles d&apos;oreilles uniques, éthiques et abordables pour sublimer votre style
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-5 gap-6 overflow-visible place-items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {advantages.map((advantage) => (
            <motion.div
              key={advantage.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[280px] md:w-auto snap-center"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-dore rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-display">{advantage.title}</h3>
              <p className="text-gray-600 text-center text-sm">{advantage.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
