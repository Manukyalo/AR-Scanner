import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';
import { X, Camera, RotateCcw, Maximize2 } from 'lucide-react';

export default function ARViewPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const mindarRef = useRef(null);

  useEffect(() => {
    let active = true;

    const startAR = async () => {
      if (!containerRef.current) return;

      try {
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/band-example/band.mind',
          uiLoading: "no",
          uiScanning: "no",
        });

        const { renderer, scene, camera } = mindarThree;

        // Add a simple anchor (first target)
        const anchor = mindarThree.addAnchor(0);
        
        // Add a placeholder object to verify tracking
        const geometry = new THREE.BoxGeometry(1, 1, 0.1);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x8b5cf6, 
          transparent: true, 
          opacity: 0.7,
          metalness: 0.8,
          roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, anchor.group);
        anchor.group.add(mesh);

        // Add light to see the mesh
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        await mindarThree.start();
        
        if (active) {
          mindarRef.current = mindarThree;
          setIsInitializing(false);
          
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        }
      } catch (err) {
        console.error("AR Start Error:", err);
      }
    };

    startAR();

    return () => {
      active = false;
      if (mindarRef.current) {
        mindarRef.current.stop();
        const renderer = mindarRef.current.renderer;
        if (renderer) {
          renderer.setAnimationLoop(null);
          renderer.dispose();
        }
      }
    };
  }, [restaurantId, dishId]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      {/* AR Scene Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Loading Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center space-y-6">
           <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
           <div className="text-center space-y-2">
             <h3 className="text-xl font-bold text-white">Initializing AR</h3>
             <p className="text-slate-400 text-sm animate-pulse">Setting up premium optics...</p>
           </div>
        </div>
      )}

      {/* Premium UI Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-8 pt-20 bg-gradient-to-t from-black via-black/20 to-transparent">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white/5 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Camera className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">AR View</h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Active Session</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="h-16 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center gap-3 hover:bg-slate-800 transition group">
              <RotateCcw className="text-slate-400 group-hover:text-purple-400 transition-colors" size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Reset</span>
             </button>
             <button className="h-16 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center gap-3 hover:bg-slate-800 transition group">
              <Maximize2 className="text-slate-400 group-hover:text-purple-400 transition-colors" size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Scale</span>
             </button>
          </div>
        </div>
      </div>

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-full px-6 py-2.5 border border-white/10 flex items-center space-x-3 shadow-xl">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="text-[10px] font-mono font-bold text-slate-100 uppercase tracking-[0.2em]">Enviroment Ready</span>
        </div>
      </div>
    </div>
  );
}
