import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/authSlice';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-display font-bold gradient-text">PremiumStore</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-neon transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-neon transition-colors">Shop</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="hover:text-neon transition-colors">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-neon transition-colors">Admin</Link>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center glass rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-white px-2 w-64"
            />
            <button type="submit" className="text-neon">
              <FiSearch />
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl hover:text-neon transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <FiUser className="text-xl" />
                </button>
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-white/10">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-white/10">Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-white/10">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary px-4 py-2 text-sm">Login</button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              {isAuthenticated && (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
              )}
              <form onSubmit={handleSearch} className="flex glass rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-white flex-1"
                />
                <button type="submit" className="text-neon">
                  <FiSearch />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;