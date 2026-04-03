import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const dishes = [
    { id: 'burger', name: 'Premium Wagyu Burger', price: '$24', category: 'Main', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
    { id: 'pasta', name: 'Truffle Tagliatelle', price: '$32', category: 'Main', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24 font-sans animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold">La Gourmandise</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {dishes.map((dish) => (
          <div 
            key={dish.id}
            onClick={() => navigate(`/dish/${restaurantId}/${dish.id}`)}
            className="group relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <div className="aspect-video overflow-hidden">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                {dish.category}
              </div>
            </div>
            
            <div className="p-5 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold group-hover:text-purple-400 transition">{dish.name}</h3>
                <p className="text-slate-400 text-sm mt-1">Tap for details & AR view</p>
              </div>
              <div className="text-2xl font-black text-white">{dish.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
        <button 
          onClick={() => navigate(`/ar/test-restaurant/scan`)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-bold shadow-2xl shadow-purple-500/20 active:scale-95 transition"
        >
          Scan Menu for AR
        </button>
      </div>
    </div>
  );
}
