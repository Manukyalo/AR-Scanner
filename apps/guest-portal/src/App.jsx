import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import DishDetailPage from './pages/DishDetailPage';
import ARViewPage from './pages/ARViewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
        <Route path="/dish/:restaurantId/:dishId" element={<DishDetailPage />} />
        <Route path="/ar/:restaurantId/:dishId" element={<ARViewPage />} />
        {/* No Admin Routes here for pure Guest luxury */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
