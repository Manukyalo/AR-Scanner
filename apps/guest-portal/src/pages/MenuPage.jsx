import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@shared/firebase/config';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Sparkles, Filter, Info, ShoppingBag } from 'lucide-react';

export default function MenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Restaurant
    const fetchRest = async () => {
      const docRef = doc(db, 'restaurants', restaurantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRestaurant(docSnap.data());
    };

    // 2. Real-time Dishes
    const dishesRef = collection(db, `restaurants/${restaurantId}/dishes`);
    const unsubscribe = onSnapshot(dishesRef, (snapshot) => {
      const dishesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(d => d.active !== false); // Only show active dishes to guests
      setDishes(dishesData);
      setIsLoading(false);
    });

    fetchRest();
    return () => unsubscribe();
  }, [restaurantId]);

  const categories = ['All', ...new Set(dishes.map(d => d.category))];
  const filteredDishes = activeCategory === 'All' 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-['Outfit'] selection:bg-white/10 pb-40">
      
      {/* Editorial Header */}
      <header className="px-8 pt-12 pb-8 flex justify-between items-center sticky top-0 z-30 bg-black/80 backdrop-blur-3xl">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/')} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
           </button>
           <div className="hidden sm:block">
              <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white/90">{restaurant?.name}</h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mt-0.5">Signature Collection</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Status</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live & Spatial</span>
           </div>
           <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <ShoppingBag size={18} className="text-white/40" />
           </button>
        </div>
      </header>

      {/* Hero Brand Section */}
      <section className="px-8 mb-16 pt-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl"
         >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-6">
              Visual <span className="text-white/20 italic font-serif lowercase font-light pr-3">Gastronomy</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-light italic max-w-xl">
              Artifacts of flavor, meticulously rendered for your environment.
            </p>
         </motion.div>
      </section>

      {/* Category Navigation - Minimal & Elegant */}
      <nav className="px-8 mb-12 flex gap-8 overflow-x-auto no-scrollbar scroll-smooth items-center border-b border-white/5 pb-6">
         {categories.map((cat) => (
           <button
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap relative py-2
               ${activeCategory === cat ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
           >
             {cat}
             {activeCategory === cat && (
               <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full mt-1" />
             )}
           </button>
         ))}
      </nav>

      {/* Main Luxury Catalog */}
      <main className="px-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        <AnimatePresence mode='popLayout'>
          {filteredDishes.map((dish, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={dish.id} 
              className="group cursor-pointer"
              onClick={() => navigate(`/dish/${restaurantId}/${dish.id}`)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] mb-8 bg-white/[0.02] border border-white/5">
                 <img 
                   src={dish.thumbnailUrl} 
                   alt={dish.name} 
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[0.3] group-hover:grayscale-0"
                 />
                 
                 {/* Item Metadata Overlay */}
                 <div className="absolute top-8 right-8 flex flex-col items-end gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/80">KSh {dish.price}</span>
                    </div>
                 </div>

                 {/* Subtle Holographic Hint */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{dish.category}</span>
                       <div className="w-1 h-1 rounded-full bg-slate-800" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50 flex items-center gap-1.5">
                          <Sparkles size={10} /> Spatial Ready
                       </span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tight leading-none group-hover:text-white transition-colors">{dish.name}</h3>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Spatial Identity</p>
                       <p className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-tighter">REF_{dish.id.slice(0,8)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                       <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Floating Spatial Action Bar */}
      <div className="fixed bottom-12 inset-x-0 px-8 z-40">
         <motion.button 
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           onClick={() => navigate(`/ar/${restaurantId}/scan`)}
           className="w-full max-w-2xl mx-auto h-20 bg-white text-black rounded-[28px] overflow-hidden shadow-2xl flex items-center justify-between px-10 group active:scale-[0.98] transition-all"
         >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <Sparkles size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.3em]">Initialize Table Scan</span>
            </div>
            <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Launch Interface</span>
               <ChevronRight size={18} />
            </div>
         </motion.button>
      </div>

    </div>
  );
}
