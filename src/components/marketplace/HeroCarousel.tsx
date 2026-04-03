import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    id: 1,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/hero-banner-electronics-6f308fd7-1775241395915.webp',
    title: 'Future Tech Today',
    subtitle: 'Latest Smartphones & Gadgets',
    badge: 'Limited Offer'
  },
  {
    id: 2,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/hero-banner-fashion-cf419480-1775241396223.webp',
    title: 'Fashion Revolution',
    subtitle: 'Summer Arrivals Out Now',
    badge: 'New Collection'
  },
  {
    id: 3,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/hero-banner-home-1844da66-1775241396324.webp',
    title: 'Smart Living',
    subtitle: 'Upgrade Your Home Space',
    badge: 'Quality Living'
  }
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden group shadow-2xl shadow-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded w-fit mb-4"
            >
              {banners[current].badge}
            </motion.div>
            <motion.h2
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tighter"
            >
              {banners[current].title}
            </motion.h2>
            <motion.p
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-slate-200 text-lg md:text-2xl font-medium mb-8 max-w-md"
            >
              {banners[current].subtitle}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white text-slate-900 px-8 py-3 md:px-10 md:py-4 rounded-xl font-black text-sm md:text-base w-fit uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-black/20"
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === current ? 'bg-orange-600 w-10' : 'bg-white/30 w-3 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;