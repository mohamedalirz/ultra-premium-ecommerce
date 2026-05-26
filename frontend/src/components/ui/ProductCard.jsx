import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        background: '#1A1A1A',
        color: '#fff',
        border: '1px solid #6C63FF',
      },
    });
  };

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/500';
  const discount = product.discount || 0;
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative glass-card overflow-hidden cursor-pointer"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden h-64">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-cyber px-3 py-1 rounded-full text-white text-sm font-bold z-10">
              -{discount}%
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neon font-mono">{product.brand || 'Premium'}</span>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm text-gray-300">{rating}</span>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-neon transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">${price}</span>
              {originalPrice > price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${originalPrice}
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <FaShoppingCart />
            </motion.button>
          </div>
        </div>
      </Link>
      
      <button className="absolute top-4 left-4 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300">
        <FaHeart className="text-white hover:text-secondary transition" />
      </button>
    </motion.div>
  );
};

export default ProductCard;