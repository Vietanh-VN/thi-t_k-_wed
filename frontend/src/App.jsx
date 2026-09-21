import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import ParkingMap from './pages/ParkingMap';
import MonthlyPasses from './pages/MonthlyPasses';
import ZonesSpots from './pages/ZonesSpots';
import Pricing from './pages/Pricing';
import History from './pages/History';
import AiAssistant from './pages/AiAssistant';
import CustomerPortal from './pages/CustomerPortal';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.VaiTro)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/customer-portal" element={<CustomerPortal />} />

      {/* Main Authenticated Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/check-in"
          element={
            <ProtectedRoute allowedRoles={['QuanLy', 'NhanVien']}>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-out"
          element={
            <ProtectedRoute allowedRoles={['QuanLy', 'NhanVien']}>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route path="/parking-map" element={<ParkingMap />} />
        <Route
          path="/monthly-passes"
          element={
            <ProtectedRoute allowedRoles={['QuanLy', 'NhanVien']}>
              <MonthlyPasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zones-spots"
          element={
            <ProtectedRoute allowedRoles={['QuanLy']}>
              <ZonesSpots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute allowedRoles={['QuanLy', 'AIEngine']}>
              <Pricing />
            </ProtectedRoute>
          }
        />
        <Route path="/history" element={<History />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
