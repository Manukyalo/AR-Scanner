import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import DishDetailPage from './pages/DishDetailPage';
import ARViewPage from './pages/ARViewPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Simple mock for protected route
  const isAuthenticated = true; // In a real app, this would check Firebase Auth

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
