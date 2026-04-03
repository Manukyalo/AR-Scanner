import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-purple-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          AR Menu Scanner
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Experience the future of dining. Scan, explore, and visualize your next meal in stunning AR.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/menu/test-restaurant')}
          className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
        >
          View Demo Menu
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="px-8 py-4 bg-slate-800 text-slate-300 font-medium rounded-2xl transition-all hover:bg-slate-700 active:scale-95"
        >
          Admin Login
        </button>
      </div>

      <div className="absolute bottom-8 text-slate-500 text-sm font-mono tracking-widest uppercase">
        Developed for Excellence
      </div>
    </div>
  );
}
