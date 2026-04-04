import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Globe, Sparkles, Command } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const spring = { type: "spring", stiffness: 100, damping: 20 };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-['Outfit'] selection:bg-purple-500/30">
      
      {/* Structural Luxe Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Cinematic Aura */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-white/[0.03] blur-[160px] rounded-full pointer-events-none" />

      {/* Top Protocol Bar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-10 md:px-16">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
               <Sparkles size={18} className="text-white/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Guest Terminal</span>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-slate-700 text-[10px] font-black uppercase tracking-widest">
               <span>System Active</span>
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
         </div>
      </nav>

      {/* Guest Entry Content */}
      <main className="relative z-10 container mx-auto px-8 pt-20 pb-24 flex flex-col items-center">
        
        {/* Monolith App Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-24 group pointer-events-none"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[64px] flex items-center justify-center p-12 overflow-hidden shadow-2xl border-t-white/15">
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08]" />
             <img 
               src="/logo.png" 
               alt="Luxury Monogram" 
               className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
             />
          </div>
          <div className="absolute -inset-4 border border-white/5 rounded-[80px] -z-10 animate-pulse duration-[4000ms]" />
        </motion.div>

        {/* Guest Headline */}
        <div className="text-center space-y-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
             <h1 className="text-6xl md:text-[140px] font-black tracking-tight leading-[0.85] uppercase">
               Luxury <br />
               <span className="text-white/30 italic font-light lowercase font-serif pr-4">Spatial</span> Catalog
             </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.5 }}
            className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide italic"
          >
            "A curation of exquisite culinary artifacts, visualized in true scale within your workspace."
          </motion.p>
        </div>

        {/* Primary Guest Hook */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.7 }}
          className="mt-24 w-full max-w-sm"
        >
          <button
            onClick={() => navigate('/menu/pronto-restaurant')}
            className="group relative w-full h-24 bg-white text-black rounded-[32px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-all active:scale-[0.98] shadow-2xl overflow-hidden"
          >
             <div className="relative z-10 flex items-center justify-center gap-4">
                <span>Enter Luxury Portal</span>
                <ChevronRight size={20} className="translate-x-0 group-hover:translate-x-1.5 transition-transform" />
             </div>
             {/* Gloss Effect */}
             <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
          </button>
          <p className="text-center mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">Protocol Release 4.2.1</p>
        </motion.div>

        {/* Global Verification Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="mt-32 w-full max-w-4xl pt-12 border-t border-white/5 flex flex-wrap justify-center gap-12 text-slate-700"
        >
          <VerificationBadge icon={<Globe size={18} />} label="HSTS Encrypted" />
          <VerificationBadge icon={<ShieldCheck size={18} />} label="Vectary Engine" />
          <VerificationBadge icon={<Sparkles size={18} />} label="Spatial Reality" />
        </motion.div>

      </main>

      {/* Fixed Luxury Signature */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[1em] text-white/60">Silicon Valley Labs</span>
        <div className="w-8 h-[1px] bg-white/20" />
        <span className="text-[10px] uppercase font-light tracking-[0.3em]">Exotic Terminal v1.0.0</span>
      </div>
    </div>
  );
}

function VerificationBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
       <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
          {icon}
       </div>
       <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}
