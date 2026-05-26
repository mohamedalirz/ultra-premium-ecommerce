const express = require('express');
const { orders, products, carts } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Create new order
router.post('/', authMiddleware, (req, res) => {
  const { shippingAddress, paymentMethod, billingAddress } = req.body;
  
  // Get user cart
  const userCart = carts.get(req.user.id);
  if (!userCart || userCart.items.length === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Cart is empty' 
    });
  }
  
  // Validate stock
  for (const item of userCart.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}`
      });
    }
  }
  
  // Update stock
  for (const item of userCart.items) {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock -= item.quantity;
    }
  }
  
  // Create order
  const order = {
    id: uuidv4(),
    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    userName: req.user.name,
    items: userCart.items,
    subtotal: userCart.subtotal,
    discount: userCart.discount || 0,
    total: userCart.total,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    trackingNumber: `TRK${Math.floor(Math.random() * 1000000000)}`
  };
  
  orders.push(order);
  
  // Clear cart
  carts.delete(req.user.id);
  
  res.status(201).json({
    success: true,
    order,
    message: 'Order created successfully'
  });
});

// Get user orders
router.get('/', authMiddleware, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.id);
  
  res.json({
    success: true,
    orders: userOrders,
    total: userOrders.length
  });
});

// Get single order
router.get('/:id', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: 'Order not found' 
    });
  }
  
  // Check authorization
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied' 
    });
  }
  
  res.json({
    success: true,
    order
  });
});

// Cancel order
router.put('/:id/cancel', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: 'Order not found' 
    });
  }
  
  // Check authorization
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied' 
    });
  }
  
  // Check if order can be cancelled
  const cancellableStatuses = ['pending', 'confirmed'];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage'
    });
  }
  
  // Restore stock
  for (const item of order.items) {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock += item.quantity;
    }
  }
  
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  
  res.json({
    success: true,
    order,
    message: 'Order cancelled successfully'
  });
});

// Track order (no auth required for tracking)
router.get('/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const order = orders.find(o => o.orderNumber === orderNumber);
  
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: 'Order not found' 
    });
  }
  
  const trackingInfo = {
    orderNumber: order.orderNumber,
    status: order.status,
    estimatedDelivery: order.estimatedDelivery,
    trackingNumber: order.trackingNumber,
    timeline: [
      { status: 'Order Placed', date: order.createdAt, completed: true },
      { status: 'Confirmed', date: order.confirmedAt || null, completed: order.status !== 'pending' },
      { status: 'Processing', date: order.processingAt || null, completed: ['shipped', 'delivered'].includes(order.status) },
      { status: 'Shipped', date: order.shippedAt || null, completed: order.status === 'delivered' },
      { status: 'Delivered', date: order.deliveredAt || null, completed: order.status === 'delivered' }
    ]
  };
  
  res.json({
    success: true,
    tracking: trackingInfo
  });
});

// Get order summary for user
router.get('/summary/all', authMiddleware, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  
  const summary = {
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
    averageOrderValue: userOrders.length > 0 
      ? userOrders.reduce((sum, o) => sum + o.total, 0) / userOrders.length 
      : 0,
    completedOrders: userOrders.filter(o => o.status === 'delivered').length,
    pendingOrders: userOrders.filter(o => o.status === 'pending').length,
    cancelledOrders: userOrders.filter(o => o.status === 'cancelled').length
  };
  
  res.json({
    success: true,
    summary
  });
});

module.exports = router;