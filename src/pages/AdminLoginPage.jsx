import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white">Restaurant Admin</h2>
          <p className="text-slate-400 mt-2">Sign in to manage your immersive menu</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Domain</label>
              <input type="email" required className="w-full h-14 px-5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="admin@restaurant.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Secret Access Key</label>
              <input type="password" required className="w-full h-14 px-5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Secure Login
          </button>
        </form>

        <button onClick={() => navigate('/')} className="w-full text-slate-500 text-sm hover:text-white transition">
           Return to Landing
        </button>
      </div>
    </div>
  );
}
