import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '@shared/firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit3, 
  QrCode, 
  Download, 
  Copy, 
  X, 
  Upload, 
  Check, 
  Loader2,
  Image as ImageIcon,
  Box,
  Flame,
  Utensils,
  Search,
  Scan,
  Maximize2,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dishes'); 
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const restaurantId = 'test-restaurant'; 

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchRestaurant = async () => {
      const docRef = doc(db, 'restaurants', restaurantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRestaurant(docSnap.data());
    };
    const dishesRef = collection(db, `restaurants/${restaurantId}/dishes`);
    const unsubscribe = onSnapshot(dishesRef, (snapshot) => {
      const dishesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDishes(dishesData);
      setIsLoading(false);
    });
    fetchRestaurant();
    return () => unsubscribe();
  }, [restaurantId]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleDishStatus = async (dish) => {
    const dishRef = doc(db, `restaurants/${restaurantId}/dishes`, dish.id);
    try {
      await updateDoc(dishRef, { active: !dish.active });
    } catch (err) { console.error(err); }
  };

  const deleteDish = async (id) => {
    if (!window.confirm('Terminate this asset from the registry?')) return;
    try {
      await deleteDoc(doc(db, `restaurants/${restaurantId}/dishes`, id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Outfit'] selection:bg-white/20">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white/[0.01] border-r border-white/5 hidden lg:flex flex-col p-10 z-20">
        <div className="flex items-center gap-5 mb-24">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative group">
             <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <LayoutDashboard className="text-white relative z-10" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase leading-none">{restaurant?.name || 'ADMIN'}</h1>
            <span className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mt-1 block">Creator Suite</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <TabButton active={activeTab === 'dishes'} onClick={() => setActiveTab('dishes')} icon={<Layers size={20} />} label="Asset Catalog" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Brand Engine" />
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 p-5 text-slate-600 hover:text-white transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Terminate Session</span>
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-8 z-[60]">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white/40" />
           </div>
           <div>
             <h1 className="text-xs font-black tracking-tighter uppercase leading-none">{restaurant?.name || 'ADMIN'}</h1>
             <span className="text-[8px] font-black tracking-[0.3em] text-slate-600 uppercase mt-0.5 block">Creator Suite</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen p-8 lg:p-20 pt-28 lg:pt-20 pb-32 lg:pb-20">
        {activeTab === 'dishes' ? (
          <section className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
               <div className="space-y-4">
                 <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">Spatial Inventory</h2>
                 <p className="text-slate-500 font-light tracking-widest text-sm max-w-xl">
                   Convert physical culinary art into persistent AR assets for the global client gateway.
                 </p>
               </div>
               
               <button 
                 onClick={() => setIsScanning(true)}
                 className="flex items-center gap-4 bg-white text-black px-10 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-200 transition-all active:scale-[0.98] shadow-2xl shadow-white/5 group"
               >
                 <Scan size={20} className="group-hover:rotate-90 transition-transform" />
                 Initialize Ingestion
               </button>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {dishes.map((dish) => (
                    <DishCard 
                      key={dish.id} 
                      dish={dish} 
                      onToggle={() => toggleDishStatus(dish)}
                      onEdit={() => { setEditingDish(dish); setIsModalOpen(true); }}
                      onDelete={() => deleteDish(dish.id)}
                    />
                  ))}
                </AnimatePresence>
             </div>
          </section>
        ) : (
          <SettingsTab restaurant={restaurant} restaurantId={restaurantId} />
        )}
      </main>

      {/* Vision Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <VisionScanner 
            onClose={() => setIsScanning(false)} 
            onCaptured={(data) => {
              setEditingDish(data);
              setIsScanning(false);
              setIsModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Metadata Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <DishModal 
            dish={editingDish} 
            restaurantId={restaurantId} 
            onClose={() => { setIsModalOpen(false); setEditingDish(null); }} 
            setUploadProgress={setUploadProgress}
            uploadProgress={uploadProgress}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[28px] flex items-center justify-around px-4 z-[60] shadow-2xl">
         <MobileNavItem active={activeTab === 'dishes'} onClick={() => setActiveTab('dishes')} icon={<Layers size={22} />} />
         
         <button 
           onClick={() => setIsScanning(true)}
           className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all"
         >
           <Plus size={24} />
         </button>

         <MobileNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22} />} />
         
         <button 
           onClick={handleLogout}
           className="p-3 text-slate-600 active:text-red-500 transition-colors"
         >
           <LogOut size={22} />
         </button>
      </nav>

    </div>
  );
}

// --- Vision Scanner Component ---
function VisionScanner({ onClose, onCaptured }) {
  const [step, setStep] = useState('aim'); // aim | capture_object | capture_env | processing | complete
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Ready');
  const videoRef = useRef(null);

  useEffect(() => {
    if (['aim', 'capture_object', 'capture_env'].includes(step)) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(err => console.error("Camera access denied", err));
    }
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  // Simulate Object Capture Progress
  useEffect(() => {
    if (step === 'capture_object') {
       setScanStatus('Mapping Geometry');
       const timer = setInterval(() => {
          setProgress(p => {
             if (p >= 100) {
                clearInterval(timer);
                setTimeout(() => { setStep('capture_env'); setProgress(0); }, 1000);
                return 100;
             }
             return p + 1.25;
          });
       }, 50);
       return () => clearInterval(timer);
    }
  }, [step]);

  // Simulate Env Capture Progress
  useEffect(() => {
    if (step === 'capture_env') {
       setScanStatus('Analyzing Lux...');
       const timer = setInterval(() => {
          setProgress(p => {
             if (p >= 100) {
                clearInterval(timer);
                setTimeout(() => { setStep('processing'); setProgress(0); }, 1000);
                return 100;
             }
             return p + 2.8;
          });
       }, 50);
       return () => clearInterval(timer);
    }
  }, [step]);

  // Simulate Processing Progress
  useEffect(() => {
    if (step === 'processing') {
       setScanStatus('Synthesizing Artifact...');
       const timer = setInterval(() => {
          setProgress(p => {
             if (p >= 100) {
                clearInterval(timer);
                setTimeout(() => { 
                   onCaptured({ 
                      name: 'Spatial Asset ' + Math.floor(Math.random() * 1000), 
                      category: 'Mains',
                      description: 'High-fidelity spatial reconstruction generated via Vision Scanner.',
                      price: 2500,
                      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
                      thumbnailUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.png',
                      active: true,
                      ingredients: ['Scanned Component A', 'Scanned Component B']
                   }); 
                }, 1500);
                return 100;
             }
             return p + 2.5;
          });
       }, 50);
       return () => clearInterval(timer);
    }
  }, [step, onCaptured]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col font-['Outfit'] overflow-hidden">
      
      {/* 1. Spatial Viewfinder Foundation */}
      <div className="relative flex-1 bg-black overflow-hidden">
         {['aim', 'capture_object', 'capture_env'].includes(step) && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover opacity-60 grayscale contrast-125 brightness-75 scale-105" 
            />
         )}

         {/* Scanning Layers HUD */}
         <div className="absolute inset-0 pointer-events-none flex flex-col p-8 md:p-12">
            
            {/* Header Telemetry */}
            <div className="flex justify-between items-start pointer-events-auto">
               <button 
                 onClick={onClose} 
                 className="w-14 h-14 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-black transition-all"
               >
                  <X size={24} />
               </button>
               <div className="flex flex-col items-end gap-2 text-right">
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">SPATIAL // ACTIVE</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Protocol v4.2.9</span>
               </div>
            </div>

            {/* Main Stage: Ingestion States */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
               <AnimatePresence mode="wait">
                  {step === 'aim' && (
                    <motion.div key="aim" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="relative text-center">
                       {/* High-Tech Reticle */}
                       <div className="w-72 h-72 border border-white/5 rounded-full flex items-center justify-center relative mx-auto">
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[10px] border border-dashed border-white/10 rounded-full" 
                          />
                          <motion.div 
                            animate={{ rotate: -360 }} 
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[30px] border-2 border-t-white/20 border-transparent rounded-full" 
                          />
                          <div className="w-4 h-4 bg-white/10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                       </div>
                       
                       <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-80 pointer-events-auto">
                          <button 
                            onClick={() => setStep('capture_object')}
                            className="w-full h-20 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all"
                          >
                             Initialize Source Scan
                          </button>
                          <p className="mt-5 text-[9px] font-black uppercase tracking-widest text-white/40 leading-relaxed">Ensure lighting is uniform.<br/>Center dish in spatial grid.</p>
                       </div>
                    </motion.div>
                  )}

                  {step === 'capture_object' && (
                    <motion.div key="obj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-72 h-72 relative flex items-center justify-center border-2 border-white/10 rounded-[40px]">
                       {/* 3D Wireframe Mesh Simulation */}
                       <div className="absolute inset-x-8 inset-y-12 border border-white/20 group">
                          <div className="absolute inset-0 bg-white/10" style={{ height: `${progress}%`, transition: 'height 0.1s linear' }} />
                          <motion.div 
                            animate={{ top: ['0%', '100%'] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-x-0 h-[1.5px] bg-white shadow-[0_0_15px_white]" 
                          />
                          {/* Markers */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                       </div>
                       
                       <div className="absolute -bottom-36 text-center w-80">
                          <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-white">Compiling Vertices</h3>
                          <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_10px_white]" />
                          </div>
                          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mt-4 animate-pulse italic">Orbiting Target Artifact...</p>
                       </div>
                    </motion.div>
                  )}

                  {step === 'capture_env' && (
                    <motion.div key="env" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 overflow-hidden">
                       <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-3 p-12 opacity-40">
                          {[...Array(25)].map((_, i) => (
                            <motion.div 
                               key={i} 
                               animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.98, 1, 0.98] }} 
                               transition={{ duration: 3, delay: i * 0.05, repeat: Infinity }}
                               className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl" 
                            />
                          ))}
                       </div>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-[1px] h-48 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.8)] animate-pulse" />
                          <div className="mt-12 text-center max-w-sm">
                             <h3 className="text-emerald-500 text-2xl font-black uppercase tracking-[0.3em]">AI Environment Sweep</h3>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mt-3 leading-loose">Analyzing Global Illumination Matrix...<br/>Lux Level: 1450CD // Optimal</p>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {step === 'processing' && (
                    <motion.div key="final" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                       <div className="w-48 h-48 relative mb-12 mx-auto">
                          <motion.div 
                            animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-[3px] border-white/5 border-t-white rounded-[48px] shadow-[0_0_50px_rgba(255,255,255,0.05)]" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Sparkles className="text-white" size={44} />
                          </div>
                       </div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Materializing Spatial Asset</h3>
                       <div className="w-72 h-1 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_20px_white]" />
                       </div>
                       <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Binary Mesh Inversion {progress}%</p>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Bottom HUD Telemetry */}
            <div className="h-24 border-t border-white/5 flex items-center justify-between pointer-events-auto">
               <div className="flex gap-12">
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Task</span>
                     <span className="text-[12px] font-bold uppercase tracking-tighter text-white/90">{scanStatus}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Geometry</span>
                     <span className="text-[12px] font-bold uppercase tracking-tighter text-white/90">{Math.floor(progress * 13.2)}K Polys</span>
                  </div>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Optimization</span>
                  <span className="text-[12px] font-black uppercase tracking-widest text-emerald-500">Tier: Elite</span>
               </div>
            </div>

         </div>
      </div>
    </motion.div>
  );
}

// --- Mobile Navigation Components ---
function MobileNavItem({ active, icon, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative p-3 transition-all ${active ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
    >
      {icon}
      {active && (
        <motion.div layoutId="mobileTab" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      )}
    </button>
  );
}

// --- TabButton, DishCard, etc. keep similar UX but improved design ---

function TabButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-5 w-full p-5 rounded-3xl transition-all ${active ? 'bg-white text-black shadow-2xl' : 'text-slate-600 hover:text-slate-300'}`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-[0.3em]">{label}</span>
    </button>
  );
}

function DishCard({ dish, onToggle, onEdit, onDelete }) {
  return (
    <motion.div layout className="group relative bg-zinc-900/40 border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 hover:bg-zinc-800/60 transition-all overflow-hidden shadow-2xl">
       <div className="w-full md:w-36 h-36 bg-black/40 rounded-[32px] overflow-hidden border border-white/5 relative flex-shrink-0">
          <img src={dish.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" />
          <div className="absolute top-4 right-4"><div className={`w-2 h-2 rounded-full ${dish.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-slate-700'}`} /></div>
       </div>
       <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{dish.category}</span>
             <div className="flex gap-4">
                <button onClick={onEdit} className="text-white/20 hover:text-white transition-colors p-2"><Edit3 size={18} /></button>
                <button onClick={onDelete} className="text-white/10 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
             </div>
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white/90 mb-1">{dish.name}</h3>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">KSh {dish.price}</span>
             <div className="w-1 h-1 bg-white/10 rounded-full" />
             <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${dish.active ? 'text-emerald-500/80' : 'text-white/20'}`}>
                {dish.active ? 'Syncing with Portal' : 'Draft Mode'}
             </div>
          </div>
          <button onClick={onToggle} className="mt-8 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
             <div className={`w-10 h-5 rounded-full p-1 transition-colors ${dish.active ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/10'}`}>
                <motion.div 
                  layout
                  className={`w-2.5 h-2.5 rounded-full ${dish.active ? 'translate-x-5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'translate-x-0 bg-white/10'}`} 
                />
             </div>
             Status Update
          </button>
       </div>
    </motion.div>
  );
}

// --- Settings & Modal logic remains robust as before ---
function SettingsTab({ restaurant, restaurantId }) {
  const [formData, setFormData] = useState({ name: '', brandColor: '#ffffff', ctaLabel: '', ctaUrl: '', logo: '', guestPortalUrl: '' });
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => { 
    if (restaurant) setFormData({ guestPortalUrl: '', ...restaurant }); 
  }, [restaurant]);

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setSaving(true);
    const storageRef = ref(storage, `restaurants/${restaurantId}/brand/logo-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed', 
      (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
      (err) => { alert('Logo Upload Failed'); setSaving(false); }, 
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, logo: url }));
        setSaving(false);
        setUploadProgress(0);
      }
    );
  };

  useEffect(() => {
    const generateQR = async () => {
      if (!formData.guestPortalUrl) {
         setQrCodeData('');
         return;
      }
      try {
        const url = await QRCode.toDataURL(formData.guestPortalUrl, {
          width: 400,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
        setQrCodeData(url);
      } catch (err) { console.error('QR Generate Error', err); }
    };
    generateQR();
  }, [formData.guestPortalUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'restaurants', restaurantId), formData);
      alert('Global Registry Updated.');
    } catch (err) { alert('Sync Failed.'); } finally { setSaving(false); }
  };

  const handleDownloadQR = () => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    link.download = `${formData.name || 'restaurant'}-qr-code.png`;
    link.href = qrCodeData;
    link.click();
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-2xl mx-auto md:mx-0">
       <div className="space-y-4 mb-20 px-4 md:px-0 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Global Config</h2>
          <p className="text-white/20 font-light tracking-[0.2em] uppercase text-[10px] max-w-xl">Centralized brand DNA and external bridge configuration.</p>
       </div>

       <form onSubmit={handleSubmit} className="space-y-16">
          {/* Identity Hub */}
          <div className="space-y-8 bg-zinc-900/40 border border-white/5 rounded-[48px] p-10 md:p-12 shadow-2xl">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <Plus size={14} className="text-white/40" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/90">Identity Matrix</h3>
             </div>
             
             <div className="space-y-10">
                <LuxuryInput 
                  label="Brand Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="The Gourmet Kitchen"
                />

                <div className="space-y-4">
                  <LuxuryLabel label="Brand Asset (Logo)" />
                  <div className="relative h-20 bg-black/40 border border-white/5 rounded-3xl flex items-center px-8 overflow-hidden group">
                     {formData.logo ? (
                       <img src={formData.logo} alt="Logo" className="h-8 w-auto object-contain mr-6" />
                     ) : (
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-6">
                         <ImageIcon size={18} className="text-white/20" />
                       </div>
                     )}
                     <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                           {formData.logo ? 'Resource Synchronized' : 'Null Object / Empty'}
                        </p>
                        <p className="text-[10px] text-white/10 tracking-tighter font-mono truncate">{formData.logo || 'Select high-resolution brand artifact...'}</p>
                     </div>
                     <input type="file" accept="image/*" onChange={e => handleLogoUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                     {uploadProgress > 0 && (
                       <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="absolute bottom-0 left-0 h-0.5 bg-white shadow-[0_0_15px_white]" />
                     )}
                  </div>
                </div>
             </div>
          </div>

          {/* Infrastructure Layer */}
          <div className="space-y-8 bg-zinc-900/40 border border-white/5 rounded-[48px] p-10 md:p-12 shadow-2xl">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <Settings size={14} className="text-white/40" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/90">Infrastructure Bridge</h3>
             </div>

             <div className="space-y-12">
                <LuxuryInput 
                  label="Deployment Endpoint" 
                  value={formData.guestPortalUrl} 
                  onChange={e => setFormData({...formData, guestPortalUrl: e.target.value})} 
                  placeholder="https://gourmet-client.vercel.app"
                  type="url"
                />

                <div className="flex flex-col md:flex-row items-center gap-10 pt-4">
                   <div className="w-44 h-44 bg-black/40 rounded-[32px] border border-white/5 flex items-center justify-center overflow-hidden relative group p-4 shrink-0 shadow-2xl">
                      {qrCodeData ? (
                        <>
                           <img src={qrCodeData} alt="QR" className="w-full h-full object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity" />
                           <button onClick={handleDownloadQR} className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <Download className="text-white" size={24} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Download Asset</span>
                           </button>
                        </>
                      ) : (
                        <QrCode className="text-white/5" size={40} />
                      )}
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-lg font-bold tracking-tighter uppercase text-white/90">Physical Gateway</h4>
                      <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium leading-relaxed">
                         Synthesize a scannable access point to broadcast your culinary catalog into the client's physical environment.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <button type="submit" disabled={saving} className="w-full h-24 bg-white text-black rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50">
             {saving ? 'Transmitting Data...' : 'Commit System Update'}
          </button>
       </form>
    </section>
  );
}

function DishModal({ dish, restaurantId, onClose, setUploadProgress, uploadProgress }) {
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    price: dish?.price || 0,
    category: dish?.category || 'Mains',
    active: dish ? dish.active : true,
    thumbnailUrl: dish?.thumbnailUrl || '',
    modelUrl: dish?.modelUrl || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync formData when dish prop changes (essential for scanned data injection)
  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        price: dish.price || 0,
        category: dish.category || 'Mains',
        active: dish.active !== undefined ? dish.active : true,
        thumbnailUrl: dish.thumbnailUrl || '',
        modelUrl: dish.modelUrl || ''
      });
    }
  }, [dish]);

  const handleFileUpload = async (file, field) => {
    if (!file) return;
    setIsSubmitting(true);
    const storageRef = ref(storage, `restaurants/${restaurantId}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
      (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
      (err) => { alert('Upload err'); setIsSubmitting(false); }, 
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, [field]: url }));
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
        ...(dish?.id ? {} : { createdAt: new Date().toISOString() })
      };

      if (dish?.id) {
        await updateDoc(doc(db, `restaurants/${restaurantId}/dishes`, dish.id), dataToSave);
      } else {
        await addDoc(collection(db, `restaurants/${restaurantId}/dishes`), dataToSave);
      }
      onClose();
    } catch (err) { 
      console.error('Commit Error:', err);
      alert(`Commit failure: ${err.message || 'Unknown protocol error'}`); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl overflow-y-auto no-scrollbar">
       <div className="bg-neutral-950 border border-white/10 w-full max-w-4xl rounded-[48px] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] my-auto">
          <div className="p-10 pb-4 flex justify-between items-start">
             <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white/90">Asset Metadata</h2>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Registry Ingestion Active</span>
                </div>
             </div>
             <button onClick={onClose} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <LuxuryInput 
                   label="Dish Title" 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})} 
                   placeholder="e.g. Wagyu Ribeye"
                   required
                />
                <LuxuryInput 
                   label="Exchange Value (KSh)" 
                   type="number"
                   value={formData.price} 
                   onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                   placeholder="0"
                   required
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <LuxuryLabel label="Asset Geometry (.GLB)" />
                   <div className="relative h-44 bg-black/40 border border-white/5 rounded-[32px] flex flex-col items-center justify-center group overflow-hidden border-dashed hover:border-white/20 transition-colors">
                      <Box className={`mb-4 ${formData.modelUrl ? 'text-white' : 'text-white/10'}`} size={32} />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                         {formData.modelUrl ? 'Asset Synchronized' : 'Upload Mesh Artifact'}
                      </span>
                      <input type="file" accept=".glb" onChange={e => handleFileUpload(e.target.files[0], 'modelUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {uploadProgress > 0 && formData.modelUrl === '' && (
                         <div className="absolute bottom-0 left-0 h-0.5 bg-white shadow-[0_0_10px_white]" style={{ width: `${uploadProgress}%` }} />
                      )}
                   </div>
                </div>
                <div className="space-y-4">
                   <LuxuryLabel label="Surface Map (PNG/JPG)" />
                   <div className="relative h-44 bg-black/40 border border-white/5 rounded-[32px] flex flex-col items-center justify-center group overflow-hidden border-dashed hover:border-white/20 transition-colors">
                      {formData.thumbnailUrl ? (
                        <img src={formData.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                      ) : (
                        <ImageIcon className="mb-4 text-white/10" size={32} />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                         {formData.thumbnailUrl ? 'Texture Map Active' : 'Upload Texture Source'}
                      </span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files[0], 'thumbnailUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {uploadProgress > 0 && formData.thumbnailUrl === '' && (
                         <div className="absolute bottom-0 left-0 h-0.5 bg-white shadow-[0_0_10px_white]" style={{ width: `${uploadProgress}%` }} />
                      )}
                   </div>
                </div>
             </div>

             <div className="pt-6">
                <button type="submit" disabled={isSubmitting} className="w-full h-24 bg-white text-black rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl flex items-center justify-center gap-4 hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50">
                   {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                   {dish?.id ? 'Commit Registry Change' : 'Initialize New Asset'}
                </button>
             </div>
          </form>
       </div>
    </motion.div>
  );
}

// --- Luxury UI Helper Components ---
function LuxuryInput({ label, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-3">
       <LuxuryLabel label={label} />
       <input 
         required={required}
         type={type} 
         value={value} 
         onChange={onChange}
         placeholder={placeholder}
         className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-8 focus:outline-none focus:border-white/20 transition-all font-light text-sm text-white placeholder:text-white/10"
       />
    </div>
  );
}

function LuxuryLabel({ label }) {
  return (
    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pl-2">
       {label}
    </label>
  );
}
