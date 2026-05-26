const express = require('express');
const { products, users, orders, generateAnalytics } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Apply authentication and admin check
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
});

// Get analytics dashboard data
router.get('/analytics', (req, res) => {
  const analytics = generateAnalytics();
  
  res.json({
    success: true,
    analytics
  });
});

// Get real-time stats
router.get('/realtime-stats', (req, res) => {
  const stats = {
    activeUsers: Math.floor(Math.random() * 500) + 100,
    recentOrders: orders.slice(-5),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    todayRevenue: Math.floor(Math.random() * 50000) + 10000,
    conversionRate: (Math.random() * 5 + 2).toFixed(1),
    serverUptime: process.uptime()
  };
  
  res.json({
    success: true,
    stats
  });
});

// Product management
router.get('/products', (req, res) => {
  res.json({
    success: true,
    products,
    total: products.length
  });
});

router.post('/products', (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    rating: 0,
    reviews: 0,
    createdAt: new Date(),
    tags: req.body.tags || [],
    featured: req.body.featured || false
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    product: newProduct,
    message: 'Product created successfully'
  });
});

router.put('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      message: 'Product not found' 
    });
  }
  
  products[index] = { ...products[index], ...req.body };
  
  res.json({
    success: true,
    product: products[index],
    message: 'Product updated successfully'
  });
});

router.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      message: 'Product not found' 
    });
  }
  
  products.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Order management
router.get('/orders', (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  let filteredOrders = [...orders];
  
  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
  
  res.json({
    success: true,
    orders: paginatedOrders,
    total: filteredOrders.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredOrders.length / limit)
  });
});

router.put('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: 'Order not found' 
    });
  }
  
  const oldStatus = order.status;
  order.status = status;
  
  // Add status update timestamps
  if (status === 'confirmed') order.confirmedAt = new Date();
  if (status === 'processing') order.processingAt = new Date();
  if (status === 'shipped') order.shippedAt = new Date();
  if (status === 'delivered') order.deliveredAt = new Date();
  
  res.json({
    success: true,
    order,
    message: `Order status updated from ${oldStatus} to ${status}`
  });
});

// User management
router.get('/users', (req, res) => {
  const safeUsers = users.map(({ password, ...user }) => user);
  
  res.json({
    success: true,
    users: safeUsers,
    total: safeUsers.length
  });
});

router.put('/users/:id/role', (req, res) => {
  const { role } = req.body;
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role'
    });
  }
  
  user.role = role;
  const { password, ...safeUser } = user;
  
  res.json({
    success: true,
    user: safeUser,
    message: 'User role updated successfully'
  });
});

router.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }
  
  users.splice(index, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Dashboard stats
router.get('/dashboard', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  
  const recentOrders = orders.slice(-10);
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  res.json({
    success: true,
    dashboard: {
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      recentOrders,
      lowStockProducts,
      topProducts: [...products].sort((a, b) => b.rating - a.rating).slice(0, 5)
    }
  });
});

module.exports = router;