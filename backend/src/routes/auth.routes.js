const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { users } = require('../data/mockData');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-premium-store-2024';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().trim().withMessage('Name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { email, password, name } = req.body;
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ 
      success: false,
      message: 'User already exists' 
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user',
    avatar: `https://ui-avatars.com/api/?background=6C63FF&color=fff&name=${encodeURIComponent(name)}`,
    createdAt: new Date(),
    address: {}
  };
  
  users.push(newUser);
  
  // Generate token
  const token = generateToken(newUser);
  
  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    token,
    user: userWithoutPassword,
    message: 'Registration successful'
  });
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }
  
  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }
  
  // Generate token
  const token = generateToken(user);
  
  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    token,
    user: userWithoutPassword,
    message: 'Login successful'
  });
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
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

// Forgot password (simulated)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }
  
  // In real app, send email with reset link
  res.json({ 
    success: true,
    message: 'Password reset link sent to your email',
    resetToken: 'fake-reset-token-' + Date.now()
  });
});

// Reset password (simulated)
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], (req, res) => {
  const { token, newPassword } = req.body;
  
  // In real app, verify token and update password
  res.json({ 
    success: true,
    message: 'Password reset successfully' 
  });
});

// Verify token endpoint
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    valid: true,
    user: req.user
  });
});

module.exports = router;