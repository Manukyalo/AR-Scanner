import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Menu Scans', value: '1,284', trend: '+12%', color: 'text-emerald-400' },
    { label: 'AR Views', value: '856', trend: '+8%', color: 'text-blue-400' },
    { label: 'Dish Interest', value: '92%', trend: '+5%', color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-in fade-in duration-700">
      <nav className="border-b border-slate-800 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-10 bg-slate-950/80">
        <h1 className="text-xl font-black tracking-tighter">AR MENU <span className="text-purple-500">ADMIN</span></h1>
        <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold border border-slate-700 hover:bg-slate-700 transition">Logout</button>
      </nav>

      <main className="p-8 max-w-6xl mx-auto space-y-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-2xl space-y-2">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-black leading-none">{stat.value}</span>
                <span className={`${stat.color} text-sm font-bold`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black">Manage Menu Dishes</h2>
            <button className="px-6 py-3 bg-purple-600 rounded-2xl font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-600/20 text-sm">Add New Dish</button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold bg-slate-800/20">
                  <th className="px-8 py-6">Dish Name</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {['Premium Wagyu Burger', 'Truffle Tagliatelle'].map((name, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition group">
                    <td className="px-8 py-6 font-bold text-slate-200">{name}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Active</span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-4">
                      <button className="text-slate-500 hover:text-white font-bold transition">Edit</button>
                      <button className="text-slate-500 hover:text-white font-bold transition underline-offset-4 decoration-purple-500 hover:underline">AR Model</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
