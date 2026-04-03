import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function MenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Burgers', 'Salads', 'Mains', 'Desserts', 'Drinks'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch Restaurant Header Data
        const restDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (restDoc.exists()) setRestaurant(restDoc.data());

        // Fetch Dishes
        const querySnapshot = await getDocs(collection(db, `restaurants/${restaurantId}/dishes`));
        const dishesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDishes(dishesList);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const filteredDishes = activeCategory === 'All' 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-in fade-in duration-700">
      {/* Header / Brand Identity */}
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 pb-2">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {restaurant?.logo && (
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-800">
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight">{restaurant?.name || 'Restaurant'}</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{restaurant?.location || 'Menu'}</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="p-3 bg-slate-900 rounded-2xl hover:bg-slate-800 transition shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 
                ${activeCategory === cat 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Dish Grid */}
      <main className="p-6 grid grid-cols-2 gap-4 pb-32">
        {filteredDishes.map((dish) => (
          <div 
            key={dish.id} 
            onClick={() => navigate(`/dish/${restaurantId}/${dish.id}`)}
            className="group relative bg-slate-900/50 border border-slate-800/50 rounded-3xl overflow-hidden cursor-pointer hover:border-slate-600 transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={dish.thumbnailUrl} 
                alt={dish.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
              />
              <div className="absolute top-2.5 right-2.5 flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl border 
                  ${dish.isVeg 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md' 
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30 backdrop-blur-md'}`}>
                  {dish.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <h3 className="font-bold text-sm leading-tight group-hover:text-purple-400 transition line-clamp-1">{dish.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-extrabold text-lg">${dish.price}</span>
                <span className="text-[10px] text-slate-500 font-mono">{dish.calories} kcal</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* AR Floating Action Bar */}
      <div className="fixed bottom-8 inset-x-0 px-6 z-30">
        <button 
          onClick={() => navigate(`/ar/${restaurantId}/scan`)}
          className="w-full h-16 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-3xl font-black text-lg shadow-2xl shadow-purple-600/40 transform active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span>SCAN MENU</span>
        </button>
      </div>
    </div>
  );
}
