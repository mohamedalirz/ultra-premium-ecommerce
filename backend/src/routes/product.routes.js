const express = require('express');
const { products, categories } = require('../data/mockData');

const router = express.Router();

// Get all products with filtering, sorting, pagination
router.get('/', (req, res) => {
  let { 
    page = 1, 
    limit = 12, 
    category, 
    minPrice, 
    maxPrice,
    sort,
    search,
    rating,
    tag,
    brand
  } = req.query;
  
  let filteredProducts = [...products];
  
  // Search filter
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Category filter
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Brand filter
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand === brand);
  }
  
  // Price filter
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  // Rating filter
  if (rating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(rating));
  }
  
  // Tag filter
  if (tag) {
    filteredProducts = filteredProducts.filter(p => p.tags && p.tags.includes(tag));
  }
  
  // Sorting
  if (sort) {
    switch(sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'discount':
        filteredProducts.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    products: paginatedProducts,
    total: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredProducts.length / limit),
    categories: categories,
    filters: {
      brands: [...new Set(products.map(p => p.brand))],
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    }
  });
});

// Get featured products
router.get('/featured/list', (req, res) => {
  const featured = products.filter(p => p.featured === true);
  res.json({
    success: true,
    products: featured,
    count: featured.length
  });
});

// Get trending products
router.get('/trending/list', (req, res) => {
  const trending = products.filter(p => p.tags && p.tags.includes('trending'));
  res.json({
    success: true,
    products: trending,
    count: trending.length
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ 
      success: false,
      message: 'Product not found' 
    });
  }
  
  // Get related products (same category)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  // Get recently viewed (simulated)
  const recentlyViewed = products.slice(0, 4);
  
  res.json({
    success: true,
    product,
    related,
    recentlyViewed
  });
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const categoryProducts = products.filter(p => p.category === req.params.category);
  res.json({
    success: true,
    products: categoryProducts,
    category: req.params.category,
    count: categoryProducts.length
  });
});

// Search suggestions (live search)
router.get('/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json({ success: true, suggestions: [] });
  }
  
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5)
    .map(p => ({ 
      id: p.id, 
      name: p.name, 
      price: p.price, 
      image: p.images[0],
      category: p.category
    }));
  
  res.json({
    success: true,
    suggestions,
    query: q
  });
});

// Get product statistics
router.get('/stats/overview', (req, res) => {
  const stats = {
    totalProducts: products.length,
    avgPrice: (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2),
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    categoriesCount: categories.length,
    brandsCount: [...new Set(products.map(p => p.brand))].length,
    topRated: [...products].sort((a, b) => b.rating - a.rating)[0]
  };
  res.json({ success: true, stats });
});

// Get all categories
router.get('/categories/all', (req, res) => {
  res.json({
    success: true,
    categories,
    total: categories.length
  });
});

module.exports = router;