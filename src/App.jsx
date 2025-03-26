// App.js
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import SettingPage from "./pages/settingPage";
import ProfilePage from "./pages/profilePage";
import LoginPage from './pages/student/LoginPage';
import HomePage from "./pages/student/HomePage";
import Administrator from "./pages/Administator";
import QLSV from "./components/Admin/QLSV";
import QLSach from "./components/Admin/QLSach";
import SignUpPage from './components/Admin/SignUpPage'
import AddBook from './components/Admin/AddBook';
import QLThe from './components/Admin/QLThe';
import QLMuonTra from './components/Admin/QLMuonTra';
import CreateDocket from './components/Admin/CreateDocket';

// ProtectedRoute Component (nằm ngay trong App.js)
const ProtectedRoute = ({ children, allowedPositions }) => {
  const { authUser, position } = useAuthStore();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedPositions && !allowedPositions.includes(position)) {
    return <div>Bạn không có quyền truy cập trang này.</div>; // Hoặc một trang 403 Forbidden
  }

  return children;
};

function App() {
  const { authUser, position, checkAuth, logout } = useAuthStore();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      await checkAuth();
      setLoading(false);
    };
    auth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />

        <Route path="/" element={
          authUser ? (
            position === 'Student' ? (
              <HomePage />
            ) : position === 'Administator' ? (
              <Navigate to="/admin" />
            ) : (
              <div>Bạn không có quyền truy cập trang này.</div>
            )
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
        />

        <Route path="/admin" element={
          <ProtectedRoute allowedPositions={['Administator']}>
            <Administrator />
          </ProtectedRoute>
        } />
        <Route path="/admin/managerStudent" element={
          <ProtectedRoute allowedPositions={['Administator']}>
            <QLSV />
          </ProtectedRoute>
        } />
        <Route path="/admin/managerStudent/signUp" element={<SignUpPage />} />
        <Route path="/admin/managerDocket" element={
          <ProtectedRoute allowedPositions={['Administator']}>
            <QLMuonTra />
          </ProtectedRoute>
        } />
        <Route path="/admin/managerBook" element={
          <ProtectedRoute allowedPositions={['Administator']}>
            <QLSach />
          </ProtectedRoute>
        } />
        <Route path="/admin/managerBook/addBook" element={<AddBook/>} />
        <Route path="/admin/managerCard" element={
          <ProtectedRoute allowedPositions={['Administator']}>
            <QLThe />
          </ProtectedRoute>
        } />
        <Route path="/admin/managerCard/creatDocket" element={<CreateDocket/>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/setting" element={
          <ProtectedRoute>
            <SettingPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;