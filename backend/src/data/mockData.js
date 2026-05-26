const { v4: uuidv4 } = require('uuid');

// Product database
const products = [
  {
    id: '1',
    name: 'Quantum X Pro Laptop',
    price: 2499,
    originalPrice: 3299,
    category: 'Electronics',
    brand: 'Quantum',
    rating: 4.8,
    reviews: 234,
    stock: 45,
    description: 'Next-generation laptop with quantum computing capabilities and 24-hour battery life. Features the latest Intel Core i9 processor, 32GB RAM, and 2TB SSD storage. Perfect for professionals and power users.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
    ],
    specs: {
      processor: 'Quantum Core i9-14th Gen',
      ram: '32GB DDR6',
      storage: '2TB NVMe SSD',
      display: '16" 4K OLED 120Hz',
      graphics: 'RTX 5090 Ti',
      battery: '24 hours'
    },
    tags: ['trending', 'premium', 'new'],
    discount: 24,
    featured: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'NovaSphere Smart Watch',
    price: 599,
    originalPrice: 799,
    category: 'Wearables',
    brand: 'Nova',
    rating: 4.9,
    reviews: 892,
    stock: 120,
    description: 'Revolutionary smartwatch with health monitoring and satellite connectivity. Track your fitness, receive notifications, and stay connected anywhere with built-in GPS and cellular connectivity.',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'
    ],
    specs: {
      display: '1.9" AMOLED',
      battery: '7 days',
      sensors: 'ECG, Blood Oxygen, Temperature',
      waterproof: '50m',
      connectivity: '5G, Bluetooth 5.3'
    },
    tags: ['trending', 'bestseller'],
    discount: 25,
    featured: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'AuraPhones Studio X',
    price: 399,
    originalPrice: 599,
    category: 'Audio',
    brand: 'Aura',
    rating: 4.7,
    reviews: 1456,
    stock: 200,
    description: 'Studio-grade wireless headphones with spatial audio and 60-hour battery. Experience music like never before with lossless audio quality and active noise cancellation.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    specs: {
      driver: '50mm graphene',
      battery: '60 hours',
      noiseCancellation: 'Adaptive ANC',
      codecs: 'LDAC, AAC, SBC',
      weight: '250g'
    },
    tags: ['bestseller'],
    discount: 33,
    featured: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'CyberDesk Pro',
    price: 1299,
    originalPrice: 1699,
    category: 'Gaming',
    brand: 'Cyber',
    rating: 4.9,
    reviews: 567,
    stock: 30,
    description: 'Smart standing desk with built-in wireless charging and RGB ambiance. Adjust height with voice control and enjoy cable-free charging for all your devices.',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1517420879524-86d64ac2f963?w=500'
    ],
    specs: {
      size: '60" x 30"',
      heightRange: '25" - 51"',
      weightCapacity: '350 lbs',
      motors: 'Dual motor',
      features: 'Wireless charging, RGB, Voice control'
    },
    tags: ['premium'],
    discount: 23,
    featured: true,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'NeonArc Keyboard',
    price: 199,
    originalPrice: 299,
    category: 'Accessories',
    brand: 'Neon',
    rating: 4.6,
    reviews: 789,
    stock: 150,
    description: 'Mechanical keyboard with optical switches and customizable RGB matrix. Programmable macros and hot-swappable switches for the ultimate typing experience.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1618384887929-16ec33f9dde8?w=500'
    ],
    specs: {
      switches: 'Optical Red',
      keycaps: 'Double-shot PBT',
      connectivity: 'USB-C, Bluetooth 5.0',
      rgb: '16.8M colors',
      formFactor: '65%'
    },
    tags: ['trending'],
    discount: 33,
    featured: false,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '6',
    name: 'OrbMouse X3',
    price: 149,
    originalPrice: 199,
    category: 'Accessories',
    brand: 'Orb',
    rating: 4.5,
    reviews: 432,
    stock: 180,
    description: 'Ultra-precise gaming mouse with 26,000 DPI sensor and magnetic charging. Wireless with 1ms response time and customizable weight system.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
    ],
    specs: {
      sensor: '26,000 DPI Optical',
      buttons: '8 programmable',
      weight: '69g',
      battery: '100 hours',
      connectivity: '2.4GHz, Bluetooth'
    },
    tags: ['bestseller'],
    discount: 25,
    featured: false,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '7',
    name: 'Quantum Ultra Monitor',
    price: 899,
    originalPrice: 1199,
    category: 'Electronics',
    brand: 'Quantum',
    rating: 4.8,
    reviews: 234,
    stock: 55,
    description: '34" ultrawide QD-OLED monitor with 240Hz refresh rate. Perfect for gaming and professional work with HDR1000 and G-Sync support.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
      'https://images.unsplash.com/photo-1587735243612-d0d7707a0da3?w=500'
    ],
    specs: {
      size: '34"',
      resolution: '3440x1440',
      refreshRate: '240Hz',
      panelType: 'QD-OLED',
      responseTime: '0.03ms'
    },
    tags: ['premium'],
    discount: 25,
    featured: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '8',
    name: 'ZenPod Smart Speaker',
    price: 299,
    originalPrice: 399,
    category: 'Audio',
    brand: 'Zen',
    rating: 4.7,
    reviews: 567,
    stock: 95,
    description: 'AI-powered smart speaker with room calibration and 360° audio. Voice control and multi-room support with premium sound quality.',
    images: [
      'https://images.unsplash.com/photo-1589003077984-894e133ddfab?w=500',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'
    ],
    specs: {
      audio: '360° sound',
      power: '30W',
      connectivity: 'WiFi, Bluetooth 5.0',
      assistant: 'AI Voice Assistant',
      features: 'Multi-room, Room calibration'
    },
    tags: ['new'],
    discount: 25,
    featured: false,
    createdAt: new Date('2024-01-28')
  },
  {
    id: '9',
    name: 'Phantom Drone 4K',
    price: 1299,
    originalPrice: 1599,
    category: 'Electronics',
    brand: 'Phantom',
    rating: 4.9,
    reviews: 123,
    stock: 25,
    description: 'Professional drone with 4K camera and 30-minute flight time. Perfect for aerial photography and videography with obstacle avoidance.',
    images: [
      'https://images.unsplash.com/photo-1506947413955-6e72e9f8c46e?w=500',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'
    ],
    specs: {
      camera: '4K 60fps',
      flightTime: '30 minutes',
      range: '10km',
      features: 'Obstacle avoidance, GPS',
      weight: '900g'
    },
    tags: ['premium', 'new'],
    discount: 18,
    featured: true,
    createdAt: new Date('2024-01-30')
  },
  {
    id: '10',
    name: 'VR Headset Pro',
    price: 799,
    originalPrice: 999,
    category: 'Gaming',
    brand: 'VR Tech',
    rating: 4.8,
    reviews: 345,
    stock: 60,
    description: 'Premium VR headset with 4K resolution and inside-out tracking. Immersive gaming and entertainment experience.',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500'
    ],
    specs: {
      resolution: '4K per eye',
      refreshRate: '120Hz',
      tracking: 'Inside-out',
      controllers: 'Motion controllers',
      connectivity: 'Wireless'
    },
    tags: ['trending'],
    discount: 20,
    featured: false,
    createdAt: new Date('2024-01-22')
  }
];

// Users database (passwords are hashed version of 'password123')
const users = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@premiumstore.com',
    password: '$2a$10$rVYzL5kX5Y5Z5X5Y5Z5X5u', // admin123
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?background=6C63FF&color=fff&name=Admin',
    createdAt: new Date('2024-01-01'),
    address: {
      street: '123 Admin Street',
      city: 'Tech City',
      country: 'USA',
      zipCode: '12345'
    }
  },
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$rVYzL5kX5Y5Z5X5Y5Z5X5u', // user123
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?background=FF6584&color=fff&name=John',
    createdAt: new Date('2024-01-05'),
    address: {
      street: '456 User Lane',
      city: 'Consumer City',
      country: 'USA',
      zipCode: '67890'
    }
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$rVYzL5kX5Y5Z5X5Y5Z5X5u', // user123
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?background=00F0FF&color=fff&name=Jane',
    createdAt: new Date('2024-01-10'),
    address: {
      street: '789 Customer Ave',
      city: 'Shopping City',
      country: 'USA',
      zipCode: '13579'
    }
  },
  {
    id: 'user_3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: '$2a$10$rVYzL5kX5Y5Z5X5Y5Z5X5u', // user123
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?background=FF00FF&color=fff&name=Mike',
    createdAt: new Date('2024-01-15'),
    address: {
      street: '321 Buyer Blvd',
      city: 'Retail City',
      country: 'USA',
      zipCode: '24680'
    }
  }
];

// Categories
const categories = [
  { id: 'cat1', name: 'Electronics', icon: '💻', count: 25, slug: 'electronics' },
  { id: 'cat2', name: 'Wearables', icon: '⌚', count: 12, slug: 'wearables' },
  { id: 'cat3', name: 'Audio', icon: '🎧', count: 18, slug: 'audio' },
  { id: 'cat4', name: 'Gaming', icon: '🎮', count: 15, slug: 'gaming' },
  { id: 'cat5', name: 'Accessories', icon: '🔌', count: 30, slug: 'accessories' }
];

// Orders storage
let orders = [];

// Cart storage (Map: userId -> cart object)
const carts = new Map();

// Wishlist storage (Map: userId -> array of productIds)
const wishlists = new Map();

// Notifications storage (Map: userId -> array of notifications)
const notifications = new Map();

// Generate analytics data
const generateAnalytics = () => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  
  return {
    revenue: {
      total: totalRevenue,
      daily: [12500, 18200, 15600, 19800, 22400, 26700, 28900],
      weekly: 145000,
      monthly: 589000,
      growth: 23.5,
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [12500, 18200, 15600, 19800, 22400, 26700, 28900]
      }
    },
    users: {
      total: users.length,
      new: 45,
      active: 127,
      growth: 15.3
    },
    products: {
      total: products.length,
      sold: 3456,
      views: 123456,
      topProduct: products[0].name,
      topSelling: products[0]
    },
    orders: {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      completed: completedOrders,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      averageValue: orders.length > 0 ? totalRevenue / orders.length : 0
    },
    salesByCategory: categories.map(cat => ({
      name: cat.name,
      value: Math.floor(Math.random() * 10000) + 1000
    }))
  };
};

module.exports = {
  products,
  users,
  categories,
  orders,
  carts,
  wishlists,
  notifications,
  generateAnalytics
};