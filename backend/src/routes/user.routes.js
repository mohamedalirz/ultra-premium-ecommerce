const express = require('express');
const { users, wishlists, notifications, products } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }
  
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }
  
  const allowedUpdates = ['name', 'avatar', 'address'];
  allowedUpdates.forEach(field => {
    if (req.body[field]) {
      user[field] = req.body[field];
    }
  });
  
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    message: 'Profile updated successfully'
  });
});

// Get user wishlist
router.get('/wishlist', (req, res) => {
  let userWishlist = wishlists.get(req.user.id) || [];
  
  // Get full product details
  const wishlistProducts = userWishlist
    .map(productId => products.find(p => p.id === productId))
    .filter(p => p);
  
  res.json({
    success: true,
    wishlist: wishlistProducts,
    count: wishlistProducts.length
  });
});

// Add to wishlist
router.post('/wishlist', (req, res) => {
  const { productId } = req.body;
  
  // Check if product exists
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ 
      success: false,
      message: 'Product not found' 
    });
  }
  
  let userWishlist = wishlists.get(req.user.id) || [];
  
  if (!userWishlist.includes(productId)) {
    userWishlist.push(productId);
    wishlists.set(req.user.id, userWishlist);
  }
  
  const wishlistProducts = userWishlist
    .map(id => products.find(p => p.id === id))
    .filter(p => p);
  
  res.json({
    success: true,
    wishlist: wishlistProducts,
    message: 'Added to wishlist'
  });
});

// Remove from wishlist
router.delete('/wishlist/:productId', (req, res) => {
  const { productId } = req.params;
  let userWishlist = wishlists.get(req.user.id) || [];
  
  userWishlist = userWishlist.filter(id => id !== productId);
  wishlists.set(req.user.id, userWishlist);
  
  const wishlistProducts = userWishlist
    .map(id => products.find(p => p.id === id))
    .filter(p => p);
  
  res.json({
    success: true,
    wishlist: wishlistProducts,
    message: 'Removed from wishlist'
  });
});

// Check if product is in wishlist
router.get('/wishlist/check/:productId', (req, res) => {
  const { productId } = req.params;
  const userWishlist = wishlists.get(req.user.id) || [];
  
  res.json({
    success: true,
    inWishlist: userWishlist.includes(productId)
  });
});

// Get user notifications
router.get('/notifications', (req, res) => {
  let userNotifications = notifications.get(req.user.id) || [];
  
  // Sort by date (newest first)
  userNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    success: true,
    notifications: userNotifications,
    unreadCount: userNotifications.filter(n => !n.read).length
  });
});

// Mark notification as read
router.put('/notifications/:id', (req, res) => {
  const { id } = req.params;
  const userNotifications = notifications.get(req.user.id) || [];
  
  const notification = userNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    notifications.set(req.user.id, userNotifications);
  }
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

// Mark all notifications as read
router.put('/notifications/read-all', (req, res) => {
  const userNotifications = notifications.get(req.user.id) || [];
  
  userNotifications.forEach(notification => {
    notification.read = true;
  });
  
  notifications.set(req.user.id, userNotifications);
  
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// Delete notification
router.delete('/notifications/:id', (req, res) => {
  const { id } = req.params;
  let userNotifications = notifications.get(req.user.id) || [];
  
  userNotifications = userNotifications.filter(n => n.id !== id);
  notifications.set(req.user.id, userNotifications);
  
  res.json({
    success: true,
    message: 'Notification deleted'
  });
});

// Get user statistics
router.get('/stats', (req, res) => {
  const stats = {
    memberSince: users.find(u => u.id === req.user.id)?.createdAt,
    wishlistCount: (wishlists.get(req.user.id) || []).length,
    notificationCount: (notifications.get(req.user.id) || []).length
  };
  
  res.json({
    success: true,
    stats
  });
});

module.exports = router;