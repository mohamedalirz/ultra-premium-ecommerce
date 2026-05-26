import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import { 
  FiDollarSign, FiUsers, FiShoppingBag, FiTrendingUp, 
  FiPackage, FiBarChart2, FiSettings, FiGrid, FiList 
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useSocket } from '../context/SocketContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realtimeStats, setRealtimeStats] = useState({});
  const { socket, emit, on, off } = useSocket();

  const { data: analytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: adminAPI.getAnalytics
  });

  const { data: products } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: adminAPI.getProducts
  });

  const { data: orders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminAPI.getOrders
  });

  const { data: users } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminAPI.getUsers
  });

  useEffect(() => {
    if (socket) {
      emit('admin-join');
      
      on('admin-stats', (stats) => {
        setRealtimeStats(stats);
      });
      
      return () => {
        off('admin-stats');
      };
    }
  }, [socket, emit, on, off]);

  const lineChartData = {
    labels: analytics?.data?.analytics?.revenue?.chart?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: analytics?.data?.analytics?.revenue?.chart?.values || [12500, 18200, 15600, 19800, 22400, 26700, 28900],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: analytics?.data?.analytics?.salesByCategory?.map(cat => cat.name) || ['Electronics', 'Wearables', 'Audio', 'Gaming', 'Accessories'],
    datasets: [
      {
        data: analytics?.data?.analytics?.salesByCategory?.map(cat => cat.value) || [4500, 3200, 2800, 4100, 3600],
        backgroundColor: ['#6C63FF', '#FF6584', '#00F0FF', '#FF00FF', '#FFD700'],
        borderWidth: 0,
      },
    ],
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics?.data?.analytics?.revenue?.total?.toLocaleString() || '0'}`,
      change: `+${analytics?.data?.analytics?.revenue?.growth || 0}%`,
      icon: FiDollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: analytics?.data?.analytics?.orders?.total || 0,
      change: '+12%',
      icon: FiShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Total Users',
      value: analytics?.data?.analytics?.users?.total || 0,
      change: `+${analytics?.data?.analytics?.users?.growth || 0}%`,
      icon: FiUsers,
      color: 'text-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: `${realtimeStats.conversionRate || '3.2'}%`,
      change: '+0.5%',
      icon: FiTrendingUp,
      color: 'text-yellow-500'
    },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold gradient-text">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live Updates</span>
          </div>
        </div>

        {/* Real-time Stats Banner */}
        {realtimeStats.activeUsers && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">Active Users: {realtimeStats.activeUsers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-neon" />
                  <span className="text-sm">Orders Today: {realtimeStats.ordersToday}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-neon" />
                  <span className="text-sm">Revenue Today: ${realtimeStats.revenueToday?.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Top Product: {realtimeStats.topProduct}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-4 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-white/10 ${stat.color}`}>
                            <Icon className="text-2xl" />
                          </div>
                          <span className="text-green-500 text-sm">{stat.change}</span>
                        </div>
                        <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Revenue Trend</h3>
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  </div>
                  
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Sales by Category</h3>
                    <div className="h-64">
                      <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/10">
                        <tr className="text-left text-gray-400">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.data?.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-white/5">
                            <td className="py-3 text-sm">{order.orderNumber}</td>
                            <td className="py-3 text-sm">{order.userName}</td>
                            <td className="py-3 text-sm">${order.total}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-primary/20 text-primary'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold gradient-text">Manage Products</h2>
                  <button className="btn-primary px-4 py-2 text-sm">Add Product</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr className="text-left text-gray-400">
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3">Rating</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.data?.slice(0, 10).map((product) => (
                        <tr key={product.id} className="border-b border-white/5">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                              <span className="text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-sm">${product.price}</td>
                          <td className="py-3">
                            <span className={product.stock < 10 ? 'text-red-500' : 'text-green-500'}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 text-sm">{product.rating} ⭐</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button className="text-neon text-sm">Edit</button>
                              <button className="text-red-500 text-sm">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-display font-bold gradient-text mb-6">Manage Orders</h2>
                <div className="space-y-4">
                  {orders?.data?.map((order) => (
                    <div key={order.id} className="glass p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-400">{order.userName}</p>
                        </div>
                        <select
                          value={order.status}
                          className="px-3 py-1 glass rounded text-sm"
                          onChange={(e) => {
                            // Update order status
                            adminAPI.updateOrderStatus(order.id, e.target.value);
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Total: ${order.total}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-display font-bold gradient-text mb-6">Manage Users</h2>
                <div className="space-y-4">
                  {users?.data?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between glass p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={user.role}
                          className="px-3 py-1 glass rounded text-sm"
                          onChange={(e) => {
                            adminAPI.updateUserRole(user.id, e.target.value);
                          }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="text-red-500 text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;