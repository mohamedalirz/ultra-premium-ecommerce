const express = require('express');
const { carts, products } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get user cart
router.get('/', authMiddleware, (req, res) => {
  const userCart = carts.get(req.user.id);
  
  if (!userCart) {
    return res.json({
      success: true,
      cart: { items: [], subtotal: 0, total: 0, discount: 0, itemCount: 0 }
    });
  }
  
  res.json({
    success: true,
    cart: userCart
  });
});

// Add item to cart
router.post('/add', authMiddleware, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  // Find product
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ 
      success: false,
      message: 'Product not found' 
    });
  }
  
  // Check stock
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }
  
  // Get or create cart
  let userCart = carts.get(req.user.id);
  if (!userCart) {
    userCart = { 
      items: [], 
      subtotal: 0, 
      total: 0, 
      discount: 0,
      itemCount: 0
    };
  }
  
  // Check if item already exists
  const existingItem = userCart.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.items.push({
      productId,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        brand: product.brand,
        discount: product.discount
      },
      quantity,
      price: product.price
    });
  }
  
  // Calculate totals
  userCart.subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  userCart.itemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
  userCart.total = userCart.subtotal - userCart.discount;
  
  // Save cart
  carts.set(req.user.id, userCart);
  
  res.json({
    success: true,
    cart: userCart,
    message: 'Item added to cart'
  });
});

// Update cart item quantity
router.put('/update/:productId', authMiddleware, (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  
  const userCart = carts.get(req.user.id);
  if (!userCart) {
    return res.status(404).json({ 
      success: false,
      message: 'Cart not found' 
    });
  }
  
  const itemIndex = userCart.items.findIndex(item => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart'
    });
  }
  
  if (quantity <= 0) {
    // Remove item
    userCart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    userCart.items[itemIndex].quantity = quantity;
  }
  
  // Recalculate totals
  userCart.subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  userCart.itemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
  userCart.total = userCart.subtotal - (userCart.discount || 0);
  
  carts.set(req.user.id, userCart);
  
  res.json({
    success: true,
    cart: userCart,
    message: quantity <= 0 ? 'Item removed from cart' : 'Cart updated'
  });
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, (req, res) => {
  const { productId } = req.params;
  
  const userCart = carts.get(req.user.id);
  if (!userCart) {
    return res.status(404).json({ 
      success: false,
      message: 'Cart not found' 
    });
  }
  
  userCart.items = userCart.items.filter(item => item.productId !== productId);
  
  // Recalculate totals
  userCart.subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  userCart.itemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
  userCart.total = userCart.subtotal - (userCart.discount || 0);
  
  carts.set(req.user.id, userCart);
  
  res.json({
    success: true,
    cart: userCart,
    message: 'Item removed from cart'
  });
});

// Clear entire cart
router.delete('/clear', authMiddleware, (req, res) => {
  carts.delete(req.user.id);
  
  res.json({
    success: true,
    message: 'Cart cleared successfully',
    cart: { items: [], subtotal: 0, total: 0, discount: 0, itemCount: 0 }
  });
});

// Apply coupon
router.post('/apply-coupon', authMiddleware, (req, res) => {
  const { code } = req.body;
  
  // Available coupons
  const coupons = {
    'SAVE20': { discount: 20, type: 'percentage', minPurchase: 100 },
    'SAVE50': { discount: 50, type: 'fixed', minPurchase: 200 },
    'PREMIUM': { discount: 15, type: 'percentage', minPurchase: 50 },
    'WELCOME10': { discount: 10, type: 'percentage', minPurchase: 0 },
    'FLASH25': { discount: 25, type: 'percentage', minPurchase: 150 }
  };
  
  const coupon = coupons[code.toUpperCase()];
  if (!coupon) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid coupon code' 
    });
  }
  
  const userCart = carts.get(req.user.id);
  if (!userCart || userCart.items.length === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Cart is empty' 
    });
  }
  
  // Check minimum purchase
  if (userCart.subtotal < coupon.minPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase of $${coupon.minPurchase} required for this coupon`
    });
  }
  
  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (userCart.subtotal * coupon.discount) / 100;
    discount = Math.min(discount, userCart.subtotal); // Cap at subtotal
  } else {
    discount = Math.min(coupon.discount, userCart.subtotal);
  }
  
  userCart.discount = discount;
  userCart.total = userCart.subtotal - discount;
  userCart.appliedCoupon = code.toUpperCase();
  
  carts.set(req.user.id, userCart);
  
  res.json({
    success: true,
    cart: userCart,
    discount: discount,
    coupon: code.toUpperCase(),
    message: `Coupon applied! You saved $${discount}`
  });
});

// Remove coupon
router.delete('/remove-coupon', authMiddleware, (req, res) => {
  const userCart = carts.get(req.user.id);
  if (!userCart) {
    return res.status(404).json({ 
      success: false,
      message: 'Cart not found' 
    });
  }
  
  userCart.discount = 0;
  userCart.total = userCart.subtotal;
  delete userCart.appliedCoupon;
  
  carts.set(req.user.id, userCart);
  
  res.json({
    success: true,
    cart: userCart,
    message: 'Coupon removed'
  });
});

// Get cart summary
router.get('/summary', authMiddleware, (req, res) => {
  const userCart = carts.get(req.user.id);
  
  if (!userCart || userCart.items.length === 0) {
    return res.json({
      success: true,
      summary: {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        savings: 0
      }
    });
  }
  
  const summary = {
    itemCount: userCart.itemCount,
    subtotal: userCart.subtotal,
    discount: userCart.discount || 0,
    total: userCart.total,
    savings: userCart.discount || 0
  };
  
  res.json({
    success: true,
    summary
  });
});

module.exports = router;