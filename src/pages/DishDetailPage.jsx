import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import DishModelViewer from '../components/DishModelViewer';

export default function DishDetailPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch specific dish data
        const dishDoc = await getDoc(doc(db, `restaurants/${restaurantId}/dishes`, dishId));
        if (dishDoc.exists()) setDish(dishDoc.data());

        // Fetch Restaurant Header/Branding
        const restDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (restDoc.exists()) setRestaurant(restDoc.data());
      } catch (err) {
        console.error('Error fetching dish details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [restaurantId, dishId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  if (!dish) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-slate-400">
      <p>Dish not found.</p>
      <button onClick={() => navigate(`/menu/${restaurantId}`)} className="text-purple-400 font-bold ml-2">Back to Menu</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-in slide-in-from-bottom duration-700 pb-32">
      {/* Hero Section */}
      <div className="h-[45vh] w-full relative overflow-hidden">
        <img 
          src={dish.thumbnailUrl} 
          alt={dish.name} 
          className="w-full h-full object-cover transform animate-in zoom-in duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <button 
          onClick={() => navigate(`/menu/${restaurantId}`)}
          className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl hover:bg-black/60 transition shadow-2xl border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="px-8 -mt-16 relative">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border 
                ${dish.isVeg ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                {dish.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight">
                {dish.name}
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-purple-400">${dish.price}</span>
              <span className="text-xs text-slate-500 mt-1 font-mono tracking-widest uppercase">{dish.calories} kcal</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed text-lg font-medium opacity-90">
              {dish.description}
            </p>
            <div className="flex flex-wrap gap-2 py-2">
              {dish.ingredients?.map((ing, i) => (
                <span key={i} className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-400 text-sm font-bold shadow-md">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* 3D Model Viewer Section */}
          <DishModelViewer 
            modelUrl={dish.modelUrl} 
            fallbackImage={dish.thumbnailUrl} 
          />

          <div className="space-y-4 pt-4">
            <button 
              onClick={() => navigate(`/ar/${restaurantId}/${dishId}`)}
              className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl font-black text-xl shadow-2xl shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-4 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>VIEW IN AR</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
              {restaurant?.ctaUrl && (
                <a 
                  href={restaurant.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-16 bg-white text-slate-950 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-white/5 active:scale-95 transition-transform"
                >
                  {restaurant.ctaLabel || 'Action'}
                </a>
              )}
              <button 
                onClick={() => navigate(`/ar/${restaurantId}/${dishId}`)}
                className="flex items-center justify-center h-16 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-transform"
              >
                On Your Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
