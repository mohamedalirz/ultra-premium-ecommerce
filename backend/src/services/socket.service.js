const { products, orders, notifications } = require('../data/mockData');
const { v4: uuidv4 } = require('uuid');

const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    
    // User joins their personal room
    socket.on('join-user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their room`);
      socket.emit('joined', { userId, message: 'Connected to personal notifications' });
    });
    
    // Real-time order tracking
    socket.on('track-order', (orderId) => {
      console.log(`📦 Tracking order: ${orderId}`);
      
      const statuses = ['confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < statuses.length) {
          const status = statuses[index];
          socket.emit('order-status-update', {
            orderId,
            status,
            timestamp: new Date(),
            message: getStatusMessage(status)
          });
          index++;
        } else {
          clearInterval(interval);
          socket.emit('order-complete', { orderId, message: 'Your order has been delivered!' });
        }
      }, 5000);
      
      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
    
    // Send notification to user
    socket.on('send-notification', (data) => {
      const notification = {
        id: uuidv4(),
        ...data,
        timestamp: new Date(),
        read: false
      };
      
      // Store notification
      let userNotifications = notifications.get(data.userId) || [];
      userNotifications.unshift(notification);
      notifications.set(data.userId, userNotifications);
      
      // Send real-time notification
      io.to(`user_${data.userId}`).emit('new-notification', notification);
      console.log(`📨 Sent notification to user ${data.userId}`);
    });
    
    // Live inventory updates for admin
    socket.on('subscribe-inventory', () => {
      console.log('📊 Client subscribed to inventory updates');
      
      const interval = setInterval(() => {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        socket.emit('inventory-update', {
          productId: randomProduct.id,
          productName: randomProduct.name,
          stock: randomProduct.stock,
          timestamp: new Date(),
          message: `${randomProduct.name} stock: ${randomProduct.stock} units remaining`
        });
      }, 30000);
      
      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
    
    // Admin real-time dashboard
    socket.on('admin-join', () => {
      socket.join('admin-room');
      console.log('👑 Admin joined dashboard');
      
      const interval = setInterval(() => {
        const stats = {
          activeUsers: io.engine.clientsCount,
          ordersToday: Math.floor(Math.random() * 100) + 20,
          revenueToday: Math.floor(Math.random() * 50000) + 10000,
          topProduct: products[Math.floor(Math.random() * products.length)].name,
          conversionRate: (Math.random() * 5 + 2).toFixed(1),
          timestamp: new Date()
        };
        io.to('admin-room').emit('admin-stats', stats);
      }, 10000);
      
      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
    
    // Real-time chat support simulation
    socket.on('support-message', (data) => {
      console.log(`💬 Support message from ${data.userId}: ${data.message}`);
      
      // Simulate auto-reply
      setTimeout(() => {
        socket.emit('support-reply', {
          message: "Thank you for contacting support. An agent will assist you shortly.",
          timestamp: new Date(),
          autoReply: true
        });
      }, 2000);
    });
    
    // Product views tracking (for analytics)
    socket.on('product-view', (productId) => {
      console.log(`👁️ Product viewed: ${productId}`);
      // In real app, you'd track this in database
      socket.emit('view-recorded', { productId, timestamp: new Date() });
    });
    
    // User activity heartbeat
    socket.on('user-activity', (userId) => {
      socket.emit('activity-ack', { userId, timestamp: new Date() });
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};

function getStatusMessage(status) {
  const messages = {
    'confirmed': '✅ Your order has been confirmed!',
    'processing': '🔄 Your order is being processed',
    'shipped': '🚚 Your order has been shipped!',
    'out-for-delivery': '📮 Your order is out for delivery',
    'delivered': '🎉 Your order has been delivered!'
  };
  return messages[status] || `Order status: ${status}`;
}

module.exports = { setupSocketIO };