import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { productAPI } from '../services/api';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Shop = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productAPI.getAll(filters)
  });

  // Extract products from response
  const products = data?.data?.products || data?.data || [];
  const totalProducts = data?.data?.total || 0;

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold gradient-text">Shop</h1>
            <p className="text-gray-400 mt-2">Showing {totalProducts} products</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gradient-to-r from-primary to-secondary' : 'glass'}`}
            >
              <FiGrid />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gradient-to-r from-primary to-secondary' : 'glass'}`}
            >
              <FiList />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter />
              <h3 className="font-semibold">Filters</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Category</label>
                <select 
                  className="w-full p-2 glass rounded-xl outline-none focus:border-neon transition"
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Audio">Audio</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Sort By</label>
                <select 
                  className="w-full p-2 glass rounded-xl outline-none focus:border-neon transition"
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Price Range</label>
                <input 
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 glass rounded-xl mb-2 outline-none focus:border-neon transition"
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
                <input 
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 glass rounded-xl outline-none focus:border-neon transition"
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;