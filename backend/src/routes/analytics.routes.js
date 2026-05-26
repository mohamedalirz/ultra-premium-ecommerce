const express = require('express');
const { products, orders, users, generateAnalytics } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get analytics dashboard (user-specific or admin)
router.get('/dashboard', authMiddleware, (req, res) => {
  const isAdmin = req.user.role === 'admin';
  
  if (isAdmin) {
    // Admin analytics
    const analytics = generateAnalytics();
    res.json({
      success: true,
      analytics,
      role: 'admin'
    });
  } else {
    // User analytics
    const userOrders = orders.filter(order => order.userId === req.user.id);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({
      success: true,
      analytics: {
        totalOrders: userOrders.length,
        totalSpent,
        averageOrderValue: userOrders.length > 0 ? totalSpent / userOrders.length : 0,
        lastOrder: userOrders[userOrders.length - 1] || null,
        favoriteCategory: getFavoriteCategory(userOrders)
      },
      role: 'user'
    });
  }
});

// Helper function to get user's favorite category
function getFavoriteCategory(orders) {
  const categoryCount = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product.category;
      categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
    });
  });
  
  if (Object.keys(categoryCount).length === 0) return null;
  
  return Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];
}

// Real-time analytics
router.get('/realtime', authMiddleware, (req, res) => {
  const isAdmin = req.user.role === 'admin';
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Real-time analytics available for admin only'
    });
  }
  
  const stats = {
    activeUsers: Math.floor(Math.random() * 1000) + 100,
    salesToday: Math.floor(Math.random() * 50000) + 10000,
    ordersToday: Math.floor(Math.random() * 100) + 10,
    conversionRate: (Math.random() * 5 + 2).toFixed(1),
    pageViews: Math.floor(Math.random() * 10000) + 1000,
    topSearchTerms: ['laptop', 'headphones', 'smartwatch', 'keyboard', 'monitor'],
    timestamp: new Date()
  };
  
  res.json({
    success: true,
    stats
  });
});

// Sales by category
router.get('/sales-by-category', authMiddleware, (req, res) => {
  const isAdmin = req.user.role === 'admin';
  
  if (!isAdmin) {
    const userOrders = orders.filter(o => o.userId === req.user.id);
    const categorySales = {};
    
    userOrders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
      });
    });
    
    return res.json({
      success: true,
      data: Object.entries(categorySales).map(([category, sales]) => ({ category, sales }))
    });
  }
  
  // Admin view - all sales
  const categorySales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product.category;
      categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
    });
  });
  
  res.json({
    success: true,
    data: Object.entries(categorySales).map(([category, sales]) => ({ category, sales }))
  });
});

// Sales over time
router.get('/sales-timeline', authMiddleware, (req, res) => {
  const { period = 'week' } = req.query;
  const isAdmin = req.user.role === 'admin';
  
  let filteredOrders = isAdmin ? orders : orders.filter(o => o.userId === req.user.id);
  
  // Group by date
  const salesByDate = {};
  filteredOrders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    salesByDate[date] = (salesByDate[date] || 0) + order.total;
  });
  
  const timeline = Object.entries(salesByDate)
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // Last 30 days
  
  res.json({
    success: true,
    period,
    timeline
  });
});

// Popular products
router.get('/popular-products', authMiddleware, (req, res) => {
  const { limit = 10 } = req.query;
  const isAdmin = req.user.role === 'admin';
  
  let productSales = {};
  
  const relevantOrders = isAdmin ? orders : orders.filter(o => o.userId === req.user.id);
  
  relevantOrders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    });
  });
  
  const popularProducts = Object.entries(productSales)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return { product, quantity };
    })
    .filter(item => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
  
  res.json({
    success: true,
    products: popularProducts
  });
});

module.exports = router;