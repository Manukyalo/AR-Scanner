import React, { useState, useEffect, useRef } from 'react';

// Uses Google's <model-viewer> web component — zero npm deps, hardware accelerated
// Inject script once globally
function ensureModelViewerScript() {
  if (!document.querySelector('script[data-model-viewer]')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    script.setAttribute('data-model-viewer', 'true');
    document.head.appendChild(script);
  }
}

export default function DishModelViewer({ modelUrl, fallbackImage }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    ensureModelViewerScript();
  }, []);

  if (!modelUrl || hasError) {
    return (
      <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-800/50 bg-slate-900/20 relative group">
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt="Dish preview"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700"
          />
        )}
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
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 pointer-events-none">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">
            Initializing 3D...
          </span>
        </div>
      )}

      {/* model-viewer web component — no npm deps */}
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        alt="3D model of dish"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Live 3D badge */}
      <div className="absolute top-4 right-6 pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Live 3D</span>
        </div>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-900/80 backdrop-blur-lg px-4 py-2 rounded-full border border-slate-800">
          Drag to Inspect
        </span>
      </div>
    </div>
  );
}
