import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { X, Share2, RefreshCcw, Maximize2, Loader2, Camera, AlertCircle } from 'lucide-react';

export default function ARViewPage() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [dish, setDish] = useState(null);
  const mindarThreeRef = useRef(null);

  // 1. Fetch Dish Data
  useEffect(() => {
    async function fetchDish() {
      try {
        let dishData = null;
        
        if (dishId === 'scan') {
          // "Scan Menu" mode: Fetch the first available dish as a baseline
          const { collection, getDocs, limit, query } = await import('firebase/firestore');
          const q = query(collection(db, `restaurants/${restaurantId}/dishes`), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            dishData = querySnapshot.docs[0].data();
          }
        } else {
          // Direct dish view mode
          const dishDoc = await getDoc(doc(db, `restaurants/${restaurantId}/dishes`, dishId));
          if (dishDoc.exists()) {
            dishData = dishDoc.data();
          }
        }

        if (dishData) {
          setDish(dishData);
        } else {
          setError("Dish not found.");
          setIsInitializing(false);
        }
      } catch (err) {
        console.error("Error fetching dish:", err);
        setError("Could not load dish details.");
        setIsInitializing(false);
      }
    }
    fetchDish();
  }, [restaurantId, dishId]);

  // 2. Initialize AR
  useEffect(() => {
    if (!dish) return;

    let stopped = false;

    const startAR = async () => {
      try {
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/examples/image-tracking/assets/card-example/card.mind',
          uiScanning: "no"
        });

        const { renderer, scene, camera } = mindarThree;
        mindarThreeRef.current = mindarThree;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Anchor
        const anchor = mindarThree.addAnchor(0);

        // Load Model
        const loader = new GLTFLoader();
        loader.load(dish.modelUrl || 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/examples/image-tracking/assets/band-example/bear/scene.gltf', (gltf) => {
          const model = gltf.scene;
          
          // Scaling & Centering
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 0.5 / maxDim; // Fixed AR scale
          model.scale.setScalar(scale);
          
          const center = box.getCenter(new THREE.Vector3());
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;
          
          anchor.group.add(model);

          // Add Holographic Labels
          if (dish.ingredients && Array.isArray(dish.ingredients)) {
            dish.ingredients.slice(0, 3).forEach((ing, index) => {
              createLabel(anchor.group, ing, index);
            });
          }
        });

        await mindarThree.start();
        if (!stopped) setIsInitializing(false);

        renderer.setAnimationLoop(() => {
          const time = Date.now() * 0.002;
          // Animate labels
          anchor.group.children.forEach(child => {
            if (child.userData?.isLabel) {
              child.position.y += Math.sin(time + child.userData.offset) * 0.0005;
            }
          });
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error("AR Initialization failed:", err);
        setError("Camera failed to start. Please check permissions.");
        setIsInitializing(false);
      }
    };

    startAR();

    return () => {
      stopped = true;
      if (mindarThreeRef.current) {
        mindarThreeRef.current.stop();
        const renderer = mindarThreeRef.current.renderer;
        if (renderer) renderer.setAnimationLoop(null);
      }
    };
  }, [dish]);

  // Helper: Create Sprite Labels
  const createLabel = (parent, text, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Background Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    roundRect(ctx, 0, 0, 512, 128, 64, true);
    
    // Border
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    // Position
    const angle = (index / 3) * Math.PI * 2;
    sprite.position.set(Math.cos(angle) * 0.4, 0.3 + (index * 0.1), Math.sin(angle) * 0.4);
    sprite.scale.set(0.3, 0.075, 1);
    sprite.userData = { isLabel: true, offset: index * 2 };
    
    parent.add(sprite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this ${dish?.name || 'dish'}!`,
          text: `Check out this exclusive AR preview from our menu.`,
          url: window.location.href,
        });
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* AR Container */}
      <div id="ar-container" ref={containerRef} className="absolute inset-0" />

      {/* Permission/Loading Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-8 text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
            <Camera className="absolute inset-0 m-auto w-8 h-8 text-purple-400 opacity-50" />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-white tracking-tight">Initializing Vision</h2>
          <p className="mt-2 text-slate-400 max-w-xs text-sm leading-relaxed">
            Please allow camera access to view this dish in your environment.
          </p>
          <div className="mt-8 flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Calibrating Sensors...</span>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Something went wrong</h2>
          <p className="text-slate-400 mb-8 max-w-xs">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white text-black font-black rounded-full uppercase tracking-widest text-xs hover:bg-slate-200 transition"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Persistent UI elements */}
      {!isInitializing && !error && (
        <>
          {/* Header */}
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start pointer-events-none">
            <div className="flex items-center space-x-4 pointer-events-auto">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:scale-105 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Environment Ready</span>
                </div>
                <div className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-medium mt-0.5">Active Session</div>
              </div>
            </div>

            <button 
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto hover:bg-black/60 transition"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Bottom Info Card */}
          <div className="absolute bottom-10 inset-x-0 px-6 flex flex-col items-center pointer-events-none">
            <div className="w-full max-w-sm bg-black/40 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] pointer-events-auto shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">{dish?.name || 'Loading Dish...'}</h1>
                  <p className="text-xs text-white/60 mt-1 uppercase tracking-widest font-black">AR Preview Active</p>
                </div>
                <div className="flex items-center bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-full">
                  <Maximize2 className="w-3 h-3 text-purple-400 mr-2" />
                  <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">3D Scaled</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="flex items-center justify-center space-x-3 bg-white/5 border border-white/10 py-4 rounded-3xl hover:bg-white/10 transition group">
                  <RefreshCcw className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Reset</span>
                </button>
                <button className="flex items-center justify-center space-x-3 bg-purple-500 hover:bg-purple-400 py-4 rounded-3xl transition shadow-lg shadow-purple-500/25">
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Scale</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-[9px] text-white/30 uppercase tracking-[0.4em] font-black">
              Point at table or menu
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Canvas Helper for Rounded Rectangles
function roundRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}
