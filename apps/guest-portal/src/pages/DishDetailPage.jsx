import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@shared/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import DishModelViewer from '../components/DishModelViewer';
import { ChevronLeft, Sparkles, MapPin, Share2 } from 'lucide-react';

export default function DishDetailPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const dishDoc = await getDoc(doc(db, `restaurants/${restaurantId}/dishes`, dishId));
        if (dishDoc.exists()) setDish(dishDoc.data());

        const restDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (restDoc.exists()) setRestaurant(restDoc.data());
      } catch (err) { console.error('Details Error', err); } finally { setLoading(false); }
    };
    fetchDetails();
  }, [restaurantId, dishId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!dish) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <p className="text-slate-500 uppercase tracking-widest text-xs font-black">Plate Not Found</p>
        <button onClick={() => navigate(`/menu/${restaurantId}`)} className="text-white font-black text-sm uppercase tracking-widest border-b border-white/20 pb-1">Back to Menu</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-['Outfit'] pb-40">
      
      {/* Top Utility Bar */}
      <nav className="fixed top-0 inset-x-0 h-24 flex items-center justify-between px-8 z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
         <button 
           onClick={() => navigate(`/menu/${restaurantId}`)}
           className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center pointer-events-auto"
         >
           <ChevronLeft size={20} />
         </button>
         <button className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center pointer-events-auto">
           <Share2 size={18} className="text-white/40" />
         </button>
      </nav>

      {/* Experimental Spatial Preview */}
      <div className="w-full h-[50vh] relative pt-12">
         <div className="absolute inset-0 bg-neutral-900 animate-pulse-slow" />
         <DishModelViewer 
            modelUrl={dish.modelUrl} 
            fallbackImage={dish.thumbnailUrl} 
         />
      </div>

      {/* Content Section */}
      <div className="px-8 mt-12 space-y-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">{dish.category}</span>
              <div className="flex items-center gap-1.5 text-emerald-500/50">
                 <Sparkles size={10} />
                 <span className="text-[10px] uppercase font-black tracking-widest">Spatial Artifact</span>
              </div>
           </div>
           <h1 className="text-5xl font-black tracking-tight leading-none uppercase">{dish.name}</h1>
           <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-black text-white/90">KSh {dish.price}</span>
              {dish.calories && <span className="text-xs text-slate-600 font-medium uppercase tracking-[0.2em]">{dish.calories} KCAL</span>}
           </div>
        </div>

        <div className="space-y-6">
           <p className="text-slate-400 leading-relaxed text-lg font-light italic">
             {dish.description || 'Expertly crafted culinary excellence, prepared fresh for your arrival.'}
           </p>
           {dish.ingredients && (
             <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ing, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest">{ing}</span>
                ))}
             </div>
           )}
        </div>

        {/* Primary Action */}
        <div className="fixed bottom-12 inset-x-0 px-8 z-50">
           <button 
             onClick={() => navigate(`/ar/${restaurantId}/${dishId}`)}
             className="w-full h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98] transition-transform"
           >
              <Eye size={20} />
              <span>View On Your Table</span>
           </button>
        </div>
      </div>
    </div>
  );
}

const Eye = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
