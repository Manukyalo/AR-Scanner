import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import DishDetailPage from './pages/DishDetailPage';
import ARViewPage from './pages/ARViewPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
        <Route path="/dish/:restaurantId/:dishId" element={<DishDetailPage />} />
        <Route path="/ar/:restaurantId/:dishId" element={<ARViewPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin" />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
