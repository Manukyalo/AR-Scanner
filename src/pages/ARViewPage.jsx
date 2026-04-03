import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ARViewPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // Basic MindAR boilerplate hint
    console.log(`Initializing AR for dish ${dishId} at restaurant ${restaurantId}`);
    
    // In a full implementation, we'd setup the MindAR scene here
    return () => {
      // Cleanup AR
    };
  }, [restaurantId, dishId]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      {/* AR Scene Container */}
      <div ref={containerRef} className="absolute inset-0 z-0">
        <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">
           Initializing High-Fidelity AR Environment...
        </div>
      </div>

      {/* Premium UI Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Viewing in AR</h2>
              <p className="text-slate-400 text-sm">Scan your table marker</p>
            </div>
            <button 
              onClick={() => navigate(`/dish/${restaurantId}/${dishId}`)}
              className="text-purple-400 font-bold hover:text-purple-300"
            >
              Exit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="h-16 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Rotate</span>
             </button>
             <button className="h-16 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Scale</span>
             </button>
          </div>
        </div>
      </div>

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/5 backdrop-blur rounded-full px-6 py-2 border border-white/10 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-widest">AR Mode Active</span>
        </div>
      </div>
    </div>
  );
}
