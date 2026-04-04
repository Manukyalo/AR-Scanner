import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, autoRotate }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  // Slow auto-rotation when not interacting
  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  // Normalization logic: center and fit to unit sphere
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDimension; // Scale to fit a 2-unit sphere
      scene.scale.setScalar(scale);
      
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center.multiplyScalar(scale));
    }
  }, [scene]);

  return <primitive ref={modelRef} object={scene} />;
}

export default function DishModelViewer({ modelUrl, fallbackImage }) {
  const [hasError, setHasError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  if (!modelUrl || hasError) {
    return (
      <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-800/50 bg-slate-900/20 group">
        <img 
          src={fallbackImage} 
          alt="Dish preview" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800">
            3D Preview Unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-[2.5rem] overflow-hidden border border-slate-800/50 bg-slate-950 shadow-2xl relative group">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Initializing 3D...</span>
        </div>
      }>
        <Canvas 
          shadows 
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <Model 
              url={modelUrl} 
              autoRotate={!isInteracting} 
              onError={() => setHasError(true)} 
            />
          </Stage>

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={3} 
            maxDistance={7}
            makeDefault 
          />
        </Canvas>
      </Suspense>

      {/* Decorative Overlays */}
      <div className="absolute top-4 right-6 pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Live 3D</span>
        </div>
      </div>

      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-900/80 backdrop-blur-lg px-4 py-2 rounded-full border border-slate-800">
          Drag to Inspect
        </span>
      </div>
    </div>
  );
}
