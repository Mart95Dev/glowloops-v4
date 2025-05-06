"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { InstagramPost } from '@/lib/services/instagram-service';
import { FaInstagram } from 'react-icons/fa';

interface ModernInstagramSectionProps {
  title: string;
  subtitle: string;
  instagramPosts: InstagramPost[];
  instagramUsername: string;
}

export default function ModernInstagramSection({
  title,
  subtitle,
  instagramPosts,
  instagramUsername,
}: ModernInstagramSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section ref={ref} className="min-w-[375px] py-16 px-4 bg-white">
      <div className="container mx-auto ">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-3">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {instagramPosts.map((post) => (
            <motion.div
              key={post.id}
              className="relative aspect-square overflow-hidden rounded-lg group"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Link href={post.link} target="_blank" rel="noopener noreferrer" className="relative block w-full h-full">
                <Image
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram post de GlowLoops'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 w-full">
                    <p className="text-white text-xs line-clamp-2">
                      {post.caption || `@${instagramUsername}`}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                    <FaInstagram className="h-5 w-5 text-lilas-fonce" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href={`https://instagram.com/${instagramUsername}`} target="_blank" rel="noopener noreferrer">
            <Button 
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
            >
              <FaInstagram className="h-4 w-4" />
              <span>Suivez-nous sur Instagram</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
