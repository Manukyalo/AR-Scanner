import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@shared/firebase/config';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Sparkles, ShoppingBag, Eye } from 'lucide-react';

export default function MenuPage() {
  const { restaurantId = 'test-restaurant' } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Fallback Data for the "Blank Menu" issue
  const fallbackDishes = [
    { id: 'item-1', name: 'Chef Signature Dish', price: 1500, category: 'Mains', thumbnailUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
    { id: 'item-2', name: 'Gourmet Selection', price: 850, category: 'Appetizers', thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' }
  ];

  useEffect(() => {
    // 1. Fetch Restaurant Brand
    const fetchRest = async () => {
      try {
        const docRef = doc(db, 'restaurants', restaurantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setRestaurant(docSnap.data());
      } catch (err) { console.error('Brand Fetch Failed', err); }
    };

    // 2. Real-time Dishes Fetch with Error Fallback
    const dishesRef = collection(db, `restaurants/${restaurantId}/dishes`);
    const unsubscribe = onSnapshot(dishesRef, (snapshot) => {
      if (!snapshot.empty) {
        const dishesData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(d => d.active !== false); // Only show active dishes
        setDishes(dishesData);
      } else {
        setDishes(fallbackDishes); // Avoid blank screen with placeholders
      }
      setIsLoading(false);
    }, (err) => {
      console.error('Menu Stream Error', err);
      setDishes(fallbackDishes);
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
    <div className="min-h-screen bg-neutral-950 text-white font-['Outfit'] selection:bg-white/10 pb-40">
      
      {/* Professional Brand Header */}
      <header className="px-8 pt-12 pb-8 flex justify-between items-center sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={18} />
           </button>
           <div>
              <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white/90">
                 {restaurant?.name || 'Chef Specialty'}
              </h1>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500 mt-0.5">Welcome to our Menu</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
              <ShoppingBag size={18} className="text-white/40" />
           </button>
        </div>
      </header>

      {/* Simplified Menu Title */}
      <section className="px-8 mb-12 pt-10">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl"
         >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase mb-4">
               Gourmet <br /><span className="text-white/20 italic font-serif lowercase font-light pr-2">Menu</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-lg font-light italic max-w-xl">
               Exquisite selection of dishes prepared for your enjoyment.
            </p>
         </motion.div>
      </section>

      {/* Category Nav */}
      <nav className="px-8 mb-12 flex gap-8 overflow-x-auto no-scrollbar scroll-smooth items-center border-b border-white/5 pb-6">
         {categories.map((cat) => (
           <button
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative py-2
               ${activeCategory === cat ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
           >
             {cat}
             {activeCategory === cat && (
               <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full mt-1" />
             )}
           </button>
         ))}
      </nav>

      {/* Menu Detail Cards with View on Table Button */}
      <main className="px-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        <AnimatePresence mode='popLayout'>
          {filteredDishes.map((dish, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={dish.id} 
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 bg-white/[0.02] border border-white/5">
                 <img 
                   src={dish.thumbnailUrl} 
                   alt={dish.name} 
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[0.2] group-hover:grayscale-0"
                 />
                 
                 {/* VIEW ON TABLE AR BUTTON */}
                 <div className="absolute inset-x-0 bottom-8 flex justify-center px-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/ar/${restaurantId}/${dish.id}`); }}
                      className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform"
                    >
                       <Eye size={16} />
                       On Your Table
                    </button>
                 </div>

                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4" onClick={() => navigate(`/dish/${restaurantId}/${dish.id}`)}>
                 <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{dish.category}</span>
                    <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-white transition-colors uppercase">{dish.name}</h3>
                 </div>
                 
                 <div className="flex flex-col items-end">
                    <p className="text-xl font-black text-white/90">KSh {dish.price}</p>
                    <div className="flex items-center gap-1.5 text-emerald-500/50 mt-1">
                       <Sparkles size={10} /> 
                       <span className="text-[10px] uppercase font-black tracking-widest">3D / AR View</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

    </div>
  );
}
