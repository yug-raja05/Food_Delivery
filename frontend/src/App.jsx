import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CookingModalProvider } from './context/CookingModalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import CookingModal from './components/CookingModal';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ApiClient from './services/api';

function AppContent() {
  const [feedbackStats, setFeedbackStats] = useState({ totalFeedback: 3, averageRating: 5.0 });
  const location = useLocation();

  // Scroll to hash target on navigation or scroll to top
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navbar = document.querySelector('.site-navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 80;
          const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 2;
          window.scrollTo({
            top: Math.max(0, targetPos),
            behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Load global feedback stats for footer
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await ApiClient.getFeedbackStats();
        if (res && res.data) {
          setFeedbackStats(res.data);
        }
      } catch {
        // keep fallback
      }
    };
    loadStats();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer stats={feedbackStats} />

      {/* Global Interactive Cooking Recipe Modal */}
      <CookingModal />

      {/* Floating Bottom-Right Cart Bar */}
      <FloatingCart />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <CookingModalProvider>
            <AppContent />
          </CookingModalProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
