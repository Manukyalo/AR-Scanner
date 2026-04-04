import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  LogOut, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Eye, 
  QrCode, 
  Download, 
  Copy, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Box,
  Flame,
  Utensils,
  ExternalLink,
  Search
} from 'lucide-react';
import QRCode from 'qrcode';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dishes'); // 'dishes' | 'settings'
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const restaurantId = 'pronto-restaurant'; // For demo, we use the one we seeded

  // 1. Core Data Fetch
  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch Restaurant
    const fetchRestaurant = async () => {
      const docRef = doc(db, 'restaurants', restaurantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRestaurant(docSnap.data());
    };

    // Real-time Dishes Listener
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
    navigate('/admin');
  };

  // 2. Dish CRUD Actions
  const toggleDishStatus = async (dish) => {
    const dishRef = doc(db, `restaurants/${restaurantId}/dishes`, dish.id);
    const newStatus = !dish.active;
    
    // Optimistic UI
    setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, active: newStatus } : d));
    
    try {
      await updateDoc(dishRef, { active: newStatus });
    } catch (err) {
      console.error(err);
      // Rollback
      setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, active: !newStatus } : d));
    }
  };

  const deleteDish = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    
    const dishRef = doc(db, `restaurants/${restaurantId}/dishes`, id);
    const deletedDish = dishes.find(d => d.id === id);
    
    // Optimistic UI
    setDishes(prev => prev.filter(d => d.id !== id));
    
    try {
      await deleteDoc(dishRef);
    } catch (err) {
      console.error(err);
      setDishes(prev => [...prev, deletedDish]);
    }
  };

  // 3. Modal Handlers
  const openAddModal = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Outfit'] selection:bg-purple-500/30">
      
      {/* Sidebar / Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white/[0.02] border-r border-white/10 hidden lg:flex flex-col p-8 z-20">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
             {restaurant?.logo ? (
                <img src={restaurant.logo} alt="Logo" className="w-full h-full object-cover" />
             ) : (
                <LayoutDashboard className="text-white/40" />
             )}
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">{restaurant?.name || 'Admin'}</h1>
            <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">Interactive Terminal</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <TabButton 
            active={activeTab === 'dishes'} 
            onClick={() => setActiveTab('dishes')}
            icon={<Utensils size={20} />}
            label="Menu Dishes" 
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings size={20} />}
            label="Brand Settings" 
          />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 text-slate-500 hover:text-white transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen p-8 lg:p-12">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between mb-8 pb-8 border-b border-white/10">
           <h1 className="text-xl font-black tracking-tighter uppercase">{restaurant?.name}</h1>
           <button onClick={handleLogout} className="text-slate-500"><LogOut size={24} /></button>
        </header>

        {activeTab === 'dishes' ? (
          <section className="space-y-12 animate-in fade-in duration-700">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-2">
                 <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Menu Ecosystem</h2>
                 <p className="text-slate-500 font-light tracking-wide italic">Manage your 3D spatial assets and digital menu state.</p>
               </div>
               
               <button 
                 onClick={openAddModal}
                 className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-[0.98] shadow-2xl shadow-white/5"
               >
                 <Plus size={18} />
                 Inventory Entry
               </button>
             </div>

             {/* Functional Bar */}
             <div className="flex items-center gap-4">
               <div className="relative flex-1 group">
                 <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Filter inventory by name or category..."
                   className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-[20px] pl-14 pr-6 text-sm font-light focus:outline-none focus:border-white/20 transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             </div>

             {/* Grid View */}
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence>
                  {dishes
                    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((dish) => (
                    <DishCard 
                      key={dish.id} 
                      dish={dish} 
                      onToggle={() => toggleDishStatus(dish)}
                      onEdit={() => openEditModal(dish)}
                      onDelete={() => deleteDish(dish.id)}
                    />
                  ))}
                </AnimatePresence>
             </div>

             {dishes.length === 0 && !isLoading && (
               <div className="flex flex-col items-center justify-center py-32 opacity-20 text-center space-y-4">
                  <Utensils size={64} />
                  <p className="font-black uppercase tracking-[0.3em] text-sm">Inventory Archive Empty</p>
               </div>
             )}
          </section>
        ) : (
          <SettingsTab restaurant={restaurant} restaurantId={restaurantId} />
        )}
      </main>

      {/* Complex Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <DishModal 
            dish={editingDish} 
            restaurantId={restaurantId} 
            onClose={closeModal} 
            setUploadProgress={setUploadProgress}
            uploadProgress={uploadProgress}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Sub-components ---

function TabButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-white/5 border border-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <div className={`${active ? 'text-purple-400' : 'text-inherit'} transition-colors`}>
        {icon}
      </div>
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function DishCard({ dish, onToggle, onEdit, onDelete }) {
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    if (showQR) {
      const url = `${window.location.origin}/dish/pronto-restaurant/${dish.id}`;
      QRCode.toDataURL(url, { width: 512, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, data) => {
        if (!err) setQrData(data);
      });
    }
  }, [showQR, dish.id]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 group hover:bg-white/[0.05] transition-all duration-500 overflow-hidden relative"
    >
      <div className="w-full sm:w-40 h-40 bg-white/5 rounded-[24px] overflow-hidden border border-white/5 relative flex-shrink-0">
        <img src={dish.thumbnailUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex gap-2">
           <div className={`w-2 h-2 rounded-full ${dish.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-700'}`} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
           <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{dish.category}</span>
              <div className="flex items-center gap-3">
                 <button onClick={() => setShowQR(!showQR)} className="text-slate-500 hover:text-white transition-colors"><QrCode size={18} /></button>
                 <button onClick={onEdit} className="text-slate-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                 <button onClick={onDelete} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
              </div>
           </div>
           <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-white transition-colors">{dish.name}</h3>
           <div className="flex items-center gap-4 text-xs font-light text-slate-500 mb-4">
              <div className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500/50" /> {dish.calories} KCAL</div>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <div className="font-bold text-white/90">KSh {dish.price}</div>
           </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
           <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${dish.active ? 'text-emerald-500' : 'text-slate-600'}`}>
                {dish.active ? 'Interface Online' : 'Interface Offline'}
              </span>
           </div>
           
           <button 
             onClick={onToggle}
             className={`w-12 h-6 rounded-full relative transition-all duration-500 ${dish.active ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}
           >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${dish.active ? 'right-1 bg-emerald-500' : 'left-1 bg-slate-600'}`} />
           </button>
        </div>
      </div>

      {/* QR Overlay */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl z-10 p-8 flex flex-col items-center justify-center text-center"
          >
             <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
             <div className="w-48 h-48 bg-white p-4 rounded-3xl mb-6">
                <img src={qrData} alt="QR Code" className="w-full h-full" />
             </div>
             <div className="space-y-4 w-full">
               <button 
                 onClick={() => {
                   const a = document.createElement('a');
                   a.href = qrData;
                   a.download = `qr-${dish.id}.png`;
                   a.click();
                 }}
                 className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition"
               >
                 <Download size={16} /> Download PNG
               </button>
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(`${window.location.origin}/ar/pronto-restaurant/${dish.id}`);
                   alert('AR View Link Copied!');
                 }}
                 className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition"
               >
                 <Copy size={16} /> Copy AR Link
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsTab({ restaurant, restaurantId }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    brandColor: restaurant?.brandColor || '#ffffff',
    ctaLabel: restaurant?.ctaLabel || '',
    ctaUrl: restaurant?.ctaUrl || '',
    logo: restaurant?.logo || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant) setFormData(restaurant);
  }, [restaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'restaurants', restaurantId), formData);
      alert('Brand configuration updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to update brand config.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-12 animate-in fade-in duration-700 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Global Core</h2>
        <p className="text-slate-500 font-light tracking-wide italic">Protocol configuration for identity and external hooks.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] border border-white/10 rounded-[40px] p-10">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4">Brand Identity Name</label>
               <input 
                 type="text" 
                 className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm focus:outline-none focus:border-white/20 transition-all font-light"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4">Accent Color</label>
                  <div className="flex items-center gap-4 h-16 bg-white/5 border border-white/10 rounded-[24px] px-6">
                      <input 
                        type="color" 
                        className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                        value={formData.brandColor}
                        onChange={(e) => setFormData({...formData, brandColor: e.target.value})}
                      />
                      <span className="text-xs font-mono uppercase text-slate-400">{formData.brandColor}</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4">Logo Source</label>
                  <input 
                    type="text" 
                    placeholder="URL"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm focus:outline-none focus:border-white/20 transition-all font-light"
                    value={formData.logo}
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4">External CTA Hook</label>
               <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Label (e.g. Order Now)"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-xs focus:outline-none"
                    value={formData.ctaLabel}
                    onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})}
                  />
                  <input 
                    type="url" 
                    placeholder="Redirect URL"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-xs focus:outline-none"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({...formData, ctaUrl: e.target.value})}
                  />
               </div>
            </div>
         </div>

         <button 
           type="submit" 
           disabled={saving}
           className="w-full h-16 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
         >
           {saving ? 'Synchronizing State...' : 'Update Global Config'}
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
    calories: dish?.calories || 0,
    thumbnailUrl: dish?.thumbnailUrl || '',
    modelUrl: dish?.modelUrl || '',
    ingredients: dish?.ingredients || [],
    active: dish ? dish.active : true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (file, field) => {
    if (!file) return;
    setIsSubmitting(true);
    const storageRef = ref(storage, `restaurants/${restaurantId}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error(error);
        alert('File upload failed.');
        setIsSubmitting(false);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, [field]: downloadURL }));
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (dish) {
        await updateDoc(doc(db, `restaurants/${restaurantId}/dishes`, dish.id), formData);
      } else {
        await addDoc(collection(db, `restaurants/${restaurantId}/dishes`), formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save dish.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* Modal Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
           <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tight">{dish ? 'Update Manifest' : 'New Archive Entry'}</h2>
              <p className="text-slate-500 text-sm font-light italic">Enter spatial metadata for immersive rendering.</p>
           </div>
           <button onClick={onClose} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition"><X size={20} /></button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-12">
            
           {/* Section 1: Core Meta */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">Dish Identifier</label>
                    <input 
                      required
                      type="text" 
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">Pricing (KSh)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                 </div>
              </div>

              <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">Classification</label>
                    <select 
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                       <option className="bg-zinc-900">Mains</option>
                       <option className="bg-zinc-900">Burgers</option>
                       <option className="bg-zinc-900">Desserts</option>
                       <option className="bg-zinc-900">Drinks</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">Caloric Content (KCAL)</label>
                    <input 
                      type="number" 
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] px-6 text-sm"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: Number(e.target.value)})}
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">Sensory Description</label>
              <textarea 
                className="w-full h-32 bg-white/5 border border-white/10 rounded-[24px] p-6 text-sm font-light resize-none focus:outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
           </div>

           {/* Section 2: Uploads */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">2D Render (Thumbnail)</label>
                 <div className="relative h-40 bg-white/5 border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center group overflow-hidden">
                    {formData.thumbnailUrl ? (
                      <img src={formData.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-10 transition-opacity" />
                    ) : (
                      <ImageIcon className="text-white/20 mb-2" size={32} />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deploy Image</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e.target.files[0], 'thumbnailUrl')}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">3D Spacial Model (.GLB)</label>
                 <div className="relative h-40 bg-white/5 border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center group">
                    <Box className={`${formData.modelUrl ? 'text-purple-400' : 'text-white/20'} mb-2 transition-colors`} size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {formData.modelUrl ? 'Model Loaded ✓' : 'Deploy Payload'}
                    </span>
                    <input 
                      type="file" 
                      accept=".glb,.gltf"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e.target.files[0], 'modelUrl')}
                    />
                 </div>
              </div>
           </div>

           {/* Progress Bar */}
           {uploadProgress > 0 && (
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                />
             </div>
           )}

           {/* Section 3: Ingredients Editor */}
           <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ingredient Matrix</label>
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, ingredients: [...formData.ingredients, '']})}
                  className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors"
                 >
                   + Add Component
                 </button>
              </div>
              <div className="flex flex-wrap gap-3">
                 {formData.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 group">
                       <input 
                         type="text" 
                         className="bg-transparent border-none focus:outline-none text-xs font-light"
                         value={ing}
                         onChange={(e) => {
                            const newIngs = [...formData.ingredients];
                            newIngs[i] = e.target.value;
                            setFormData({...formData, ingredients: newIngs});
                         }}
                       />
                       <button 
                         type="button" 
                         onClick={() => setFormData({...formData, ingredients: formData.ingredients.filter((_, idx) => idx !== i)})}
                         className="text-slate-600 hover:text-red-400 transition-colors"
                       >
                         <X size={14} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </form>

        {/* Modal Footer */}
        <div className="p-8 pt-0 mt-auto">
           <button 
             type="submit" 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="w-full h-20 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.3em] text-sm hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3"
           >
             {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={20} />}
             {dish ? 'Commit Manifest Update' : 'Initialize New Entry'}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
