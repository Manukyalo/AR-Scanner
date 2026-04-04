import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@shared/firebase/config';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please verify your access key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-['Outfit']">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-12">
             <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-6 group hover:border-purple-500/50 transition-colors">
               <Lock className="text-white/40 group-hover:text-white transition-colors" size={32} />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Access</h1>
             <p className="text-slate-500 text-sm mt-2 font-light">Enter credentials to manage your AR ecosystem</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white focus:outline-none focus:border-white/20 transition-all font-light"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access Key"
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white focus:outline-none focus:border-white/20 transition-all font-light"
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="group relative w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Authorizing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-white transition-colors"
            >
              Return to Terminal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
