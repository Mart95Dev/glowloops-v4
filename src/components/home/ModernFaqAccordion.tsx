"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
// Définition du type Faq en attendant l'import correct
interface Faq {
  id: string;
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
};
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface ModernFaqAccordionProps {
  faqs: Faq[];
  title: string;
}

export default function ModernFaqAccordion({ faqs, title }: ModernFaqAccordionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section ref={ref} className="min-w-[375px] py-16 px-4 bg-gradient-to-b from-white to-creme-nude">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-4">
            {title}
          </h2>
          <p className="text-gray-600">
            Tout ce que vous devez savoir sur nos boucles d&apos;oreilles et nos services
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-lilas-clair bg-lilas-clair/5 shadow-md' : 'border-gray-200 bg-white'}`}
              variants={itemVariants}
            >
              <button
                className="flex justify-between items-center w-full p-4 text-left"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-medium text-gray-800">{faq.question}</h3>
                <span className="text-lilas-fonce ml-2">
                  {openIndex === index ? (
                    <HiChevronUp className="h-5 w-5" />
                  ) : (
                    <HiChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-4 pt-0 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href="/faq" 
            className="text-lilas-fonce hover:text-lilas-clair underline text-sm font-medium transition-colors duration-300"
          >
            Voir toutes les questions fréquentes
          </a>
        </motion.div>
      </div>
    </section>
  );
}
