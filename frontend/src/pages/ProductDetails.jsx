import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { productAPI } from '../services/api';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import ProductCard from '../components/ui/ProductCard';
import { FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id)
  });

  // Extract data from response
  const product = data?.data?.product || data?.product;
  const relatedProducts = data?.data?.related || data?.related || [];

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4">Product not found</h2>
          <a href="/shop" className="btn-primary">Back to Shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-4"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-auto rounded-xl"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4">
              <span className="text-sm text-neon font-mono">{product.brand}</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-neon">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.discount > 0 && (
                <span className="bg-gradient-to-r from-secondary to-cyber px-3 py-1 rounded-full text-sm font-bold">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full glass hover:bg-white/20 transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full glass hover:bg-white/20 transition"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-400">Stock: {product.stock} units</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary w-full py-3 mb-6 flex items-center justify-center gap-2"
            >
              <FiShoppingCart />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 glass rounded-xl">
                <FiTruck className="text-2xl mx-auto mb-2 text-neon" />
                <p className="text-xs">Free Shipping</p>
              </div>
              <div className="text-center p-3 glass rounded-xl">
                <FiShield className="text-2xl mx-auto mb-2 text-neon" />
                <p className="text-xs">2 Year Warranty</p>
              </div>
              <div className="text-center p-3 glass rounded-xl">
                <FiRefreshCw className="text-2xl mx-auto mb-2 text-neon" />
                <p className="text-xs">30 Day Returns</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specs && (
              <div className="glass-card p-4">
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;