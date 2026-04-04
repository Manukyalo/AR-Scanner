import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, UtensilsCrossed } from 'lucide-react';
import { db } from '@shared/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function LandingPage() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState('The Artisan Kitchen');
  const restaurantId = 'test-restaurant'; 

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const docRef = doc(db, 'restaurants', restaurantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().name) {
          setRestaurantName(docSnap.data().name);
        }
      } catch (err) { console.error('Brand Fetch Failed', err); }
    };
    fetchBrand();
  }, []);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center font-['Outfit'] px-8 overflow-hidden">
      
      {/* Decorative Subtle Background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

      {/* Main Branding Monolith */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center space-y-12 max-w-lg"
      >
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
           <UtensilsCrossed size={32} className="text-white/40" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">
            Welcome to <br />
            <span className="text-white/20 italic font-serif lowercase font-light block mt-2">
               {restaurantName}
            </span>
          </h1>
          <p className="text-neutral-500 text-sm md:text-lg font-light tracking-widest uppercase">
            Experience our Menu in Augmented Reality
          </p>
        </div>

        <button
          onClick={() => navigate(`/menu/${restaurantId}`)}
          className="group relative w-full h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-2xl"
        >
          Explore Menu
        </button>
      </motion.div>

      {/* Footer Branding (Simplified) */}
      <footer className="absolute bottom-12 text-[9px] font-black uppercase tracking-[0.6em] text-neutral-700 opacity-50">
        Professional Client Portal
      </footer>
    </div>
  );
}
