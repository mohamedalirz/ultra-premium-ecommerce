import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-display font-bold gradient-text">404</h1>
        </motion.div>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;