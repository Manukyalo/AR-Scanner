import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function DishDetailPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();

  const dishDetails = {
    burger: {
      name: 'Premium Wagyu Burger',
      price: '$24',
      calories: '850 kcal',
      ingredients: ['Aged Gruyère', 'Truffle Mayo', 'Caramelized Onion', 'Wagyu Beef'],
      description: 'Our signature Wagyu beef patty, aged for 21 days, served with a perfect balance of savory truffle and sweet onion jam on a toasted brioche bun.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
    },
    pasta: {
      name: 'Truffle Tagliatelle',
      price: '$32',
      calories: '640 kcal',
      ingredients: ['Fresh Tagliatelle', 'Black Autumn Truffle', 'Pecorino Romano'],
      description: 'Silky, hand-made tagliatelle pasta tossed in an exquisite, creamy black truffle sauce, topped with paper-thin shavings of fresh truffle.',
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800'
    }
  };

  const dish = dishDetails[dishId] || dishDetails.burger;

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-in zoom-in duration-500">
      <div className="h-2/5 w-full relative overflow-hidden">
        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <button 
          onClick={() => navigate(`/menu/${restaurantId}`)}
          className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl hover:bg-black/60 transition shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="p-8 -mt-12 relative h-svh bg-slate-950 rounded-t-[40px] shadow-2xl space-y-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {dish.name}
            </h1>
            <div className="text-3xl font-extrabold text-purple-400">{dish.price}</div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {dish.ingredients.map((ing, i) => (
              <span key={i} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm whitespace-nowrap shadow-md">
                {ing}
              </span>
            ))}
          </div>

          <p className="text-slate-300 leading-relaxed text-lg">
            {dish.description}
          </p>
        </div>

        <button 
          onClick={() => navigate(`/ar/${restaurantId}/${dishId}`)}
          className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl font-black text-xl shadow-2xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 mb-24"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A1 1 0 0120 13.17V17a2 2 0 01-2 2h-2M9 5a2 2 0 114 0 2 2 0 01-4 0zM9 11h2m4 0h2m-7 1v7m4-7v7m-3-10h3m-9 10H5a2 2 0 01-2-2v-4a2 2 0 012-2h2m0 10l1 1m0 0l1-1m-1 1v-7" />
          </svg>
          <span>View in AR</span>
        </button>
      </div>
    </div>
  );
}
