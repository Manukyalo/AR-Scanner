import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanFace, UtensilsCrossed, Sparkles, ChevronRight, LayoutDashboard, Globe, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const spring = { type: "spring", stiffness: 100, damping: 20 };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-['Outfit'] selection:bg-purple-500/30">
      
      {/* Structural Grid Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Floating Light Leak */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center">
        
        {/* The Hologram Monogram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-20 group"
        >
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] flex items-center justify-center p-8 overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border-t-white/20 group-hover:border-white/30 transition-all duration-700">
             {/* Inner reflections */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] rotate-12" />
             <img 
               src="/logo.png" 
               alt="AR Monogram" 
               className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-700"
             />
          </div>
          
          {/* Status Badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/70">System v4.0.2 Ready</span>
          </div>
        </motion.div>

        {/* Cinematic Headline */}
        <div className="text-center space-y-8 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95]"
          >
            THE NEW DIMENSION <br />
            <span className="text-white/40">OF INTERACTION.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            A spatial menu experience for the world's most innovative kitchens. Visualized in stunning AR, ordered in a heartbeat.
          </motion.p>
        </div>

        {/* Interaction Grid (The Action Drawer) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-24"
        >
          {/* Main Action Tile */}
          <button
            onClick={() => navigate('/menu/pronto-restaurant')}
            className="group relative h-72 flex flex-col items-start justify-between p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left hover:bg-white/5 transition-all duration-500 hover:border-white/20 active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <ScanFace size={28} />
            </div>
            
            <div>
              <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                Experience Demo
                <ChevronRight size={24} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-slate-500 text-base font-light">Launch the full spatial interface with signature dishes.</p>
            </div>
          </button>

          {/* Sub Action Tile */}
          <button
            onClick={() => navigate('/admin')}
            className="group relative h-72 flex flex-col items-start justify-between p-10 bg-white/[0.02] border border-white/[0.05] rounded-[40px] text-left hover:bg-white/5 transition-all duration-500 active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-all duration-500">
              <LayoutDashboard size={28} className="text-slate-400 group-hover:text-white" />
            </div>
            
            <div>
              <h3 className="text-3xl font-black mb-2">Management Portal</h3>
              <p className="text-slate-500 text-base font-light">Enterprise configuration for restaurant partners.</p>
            </div>
          </button>
        </motion.div>

        {/* Technical Footer Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-32 w-full max-w-4xl pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-600"
        >
          <div className="flex items-center gap-4">
            <Globe size={20} className="text-white/20" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Global Scale</div>
              <div className="text-xs font-light">Edge-distributed infrastructure</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck size={20} className="text-white/20" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Secure Core</div>
              <div className="text-xs font-light">HSTS & SOC2 Compliance Standard</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sparkles size={20} className="text-white/20" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">MindAR v1.2</div>
              <div className="text-xs font-light">Sub-pixel precision tracking</div>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Floating Signature */}
      <div className="fixed bottom-8 left-12 hidden lg:flex items-center gap-4 group opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Silicon Valley Labs</span>
        <div className="w-12 h-[1px] bg-white/20" />
        <span className="text-[10px] uppercase font-light tracking-[0.2em]">San Francisco, CA</span>
      </div>
    </div>
  );
}
