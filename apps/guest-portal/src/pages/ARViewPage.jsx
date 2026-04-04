import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@shared/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Scan, Info, Sparkles, ChevronRight, Loader2, Camera, AlertCircle } from 'lucide-react';

export default function ARViewPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const modelViewerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    async function fetchDish() {
      try {
        let dishData = null;
        if (dishId === 'scan') {
          const q = query(collection(db, `restaurants/${restaurantId}/dishes`), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) dishData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        } else {
          const dishDoc = await getDoc(doc(db, `restaurants/${restaurantId}/dishes`, dishId));
          if (dishDoc.exists()) dishData = { id: dishDoc.id, ...dishDoc.data() };
        }

        if (dishData) setDish(dishData);
        else setError("Celestial object not found.");
      } catch (err) { setError("Quantum link failure."); } finally { setIsLoading(false); }
    }
    fetchDish();
  }, [restaurantId, dishId]);

  if (isLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
       <div className="w-24 h-24 border-2 border-white/5 border-t-white rounded-full animate-spin mb-8" />
       <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Synchronizing Spatial Data</h2>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-['Outfit']">
      
      {/* 1. The Core Spatial Engine (Model Viewer) */}
      {dish && (
        <model-viewer
          ref={modelViewerRef}
          src={dish.modelUrl}
          ios-src={dish.iosModelUrl || ''} 
          alt={dish.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          camera-controls
          auto-rotate
          shadow-intensity="1.5"
          shadow-softness="1"
          exposure="1.2"
          environment-image="neutral"
          interaction-prompt="auto"
          onProgress={(e) => setProgress(Math.floor(e.detail.totalProgress * 100))}
          onLoad={() => setModelLoaded(true)}
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          className="absolute inset-0 z-0"
        >
          {/* Holographic Hotspots */}
          {modelLoaded && dish.ingredients?.map((ing, i) => (
             <button key={i} slot={`hotspot-ing-${i}`} data-position={getIngredientPosition(i)} data-normal="0 1 0" className="group relative flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
                <div className="absolute left-6 whitespace-nowrap bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">{ing}</span>
                </div>
             </button>
          ))}
          
          {/* Custom AR Button */}
          <button 
            slot="ar-button" 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center gap-3 z-50 active:scale-95 transition-all outline-none border-none ring-offset-4 ring-white/20 hover:ring-2"
          >
            <Scan size={18} />
            Place on Table
          </button>

          {/* Model Loading HUD */}
          {!modelLoaded && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-40">
                <div className="w-16 h-1 w-32 bg-white/5 rounded-full overflow-hidden mb-4">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_15px_white]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Atmospheric Materialization {progress}%</span>
             </div>
          )}
        </model-viewer>
      )}

      {/* 2. Luxury HUD Overlay */}
      <div className="absolute inset-x-0 top-0 p-8 flex justify-between items-start pointer-events-none z-10">
         <div className="flex items-center gap-4 pointer-events-auto">
            <button 
              onClick={() => navigate(-1)}
              className="w-14 h-14 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-black/60 transition"
            >
               <X size={20} className="text-white" />
            </button>
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 px-5 py-2.5 rounded-2xl">
               <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Reality Engine Online</span>
               </div>
               <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-medium italic">Surface Tracking Mode</span>
            </div>
         </div>

         <button className="w-14 h-14 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center pointer-events-auto">
            <Share2 size={20} className="text-white" />
         </button>
      </div>

      {/* 3. Bottom Spatial Metadata */}
      {dish && modelLoaded && (
        <div className="absolute bottom-32 inset-x-0 px-8 flex flex-col items-center pointer-events-none z-10">
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="w-full max-w-sm bg-black/50 backdrop-blur-[60px] border border-white/10 p-8 rounded-[40px] pointer-events-auto shadow-2xl"
           >
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-2">{dish.name}</h1>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{dish.category}</span>
                       <div className="w-1 h-1 bg-white/10 rounded-full" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/80">KSh {dish.price}</span>
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <Info size={16} className="text-slate-400" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Perspective</span>
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">1:1 SPATIAL</span>
                 </div>
                 <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Rendering</span>
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">CLEAN-FIDELITY</span>
                 </div>
              </div>
           </motion.div>
        </div>
      )}

      {/* Guide Rails */}
      <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none opacity-20 z-0">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Find a flat surface and move device slowly</p>
      </div>

    </div>
  );
}

// Logic to generate somewhat random but consistent positions for ingredient hotspots
function getIngredientPosition(index) {
  const positions = [
    "0.2 0.3 0.2",
    "-0.2 0.4 -0.1",
    "0.1 0.5 -0.3",
    "-0.3 0.2 0.3",
    "0.3 0.4 0.1"
  ];
  return positions[index % positions.length];
}
