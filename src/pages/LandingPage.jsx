import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanFace, UtensilsCrossed, Sparkles, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col items-center justify-center p-6 bg-animated-gradient"
         style={{ backgroundImage: 'radial-gradient(ellipse at 50% -20%, #1e1b4b, #020617)' }}>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[100px] mix-blend-screen pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-col items-center w-full max-w-2xl mx-auto space-y-12"
      >
        {/* Hero Icon */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative w-28 h-28 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             <ScanFace size={52} className="text-white/90 drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-sm">
            Future of Dining
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-lg mx-auto font-light leading-relaxed">
            Don't just read the menu. <span className="text-white font-semibold flex items-center justify-center gap-2 inline-flex"><Sparkles size={18} className="text-brand-secondary"/> Experience it.</span> Scan, explore, and visualize your next meal in stunning AR before you order.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full max-w-md mt-4">
          <button
            onClick={() => navigate('/menu/test-restaurant')}
            className="flex-1 group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <UtensilsCrossed size={20} className="relative z-10" />
            <span className="relative z-10">View Demo</span>
            <ChevronRight size={18} className="relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
          
          <button
            onClick={() => navigate('/admin')}
            className="flex-1 group flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium rounded-2xl active:scale-95 transition-all duration-300"
          >
            <LayoutDashboard size={20} className="text-slate-400 group-hover:text-white transition-colors" />
            <span>Admin</span>
          </button>
        </motion.div>

      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 text-slate-600 text-xs font-mono tracking-[0.2em] uppercase flex items-center gap-2"
      >
        <span className="w-8 h-[1px] bg-slate-700"></span>
        Developed for Excellence
        <span className="w-8 h-[1px] bg-slate-700"></span>
      </motion.div>
    </div>
  );
}
