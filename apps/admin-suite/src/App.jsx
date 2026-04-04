import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@shared/firebase/config';

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
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={user ? <AdminDashboard /> : <Navigate to="/admin" />} 
        />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
