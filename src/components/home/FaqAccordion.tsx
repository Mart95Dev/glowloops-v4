'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title: string;
}

export const FaqAccordion = ({ faqs, title }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section className="bg-[var(--creme-nude)] py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-playfair text-2xl font-bold md:text-3xl">
          {title}
        </h2>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-gray-50"
                aria-expanded={openIndex === faq.id}
                aria-controls={`faq-content-${faq.id}`}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lilas-clair)] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-4 w-4 transition-transform ${openIndex === faq.id ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {openIndex === faq.id && (
                  <motion.div
                    id={`faq-content-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t border-gray-200 p-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
