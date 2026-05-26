import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <SocketProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-dark via-darker to-dark">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
                <Footer />
              </div>
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1A1A1A',
                    color: '#fff',
                    border: '1px solid rgba(108, 99, 255, 0.3)',
                    borderRadius: '12px',
                  },
                  duration: 3000,
                }}
              />
            </Router>
          </SocketProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;