import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { userAPI, orderAPI } from '../services/api';
import { FiUser, FiPackage, FiHeart, FiBell, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const { emit } = useSocket();

  const { data: orders } = useQuery({
    queryKey: ['userOrders'],
    queryFn: orderAPI.getOrders,
    enabled: activeTab === 'orders'
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: userAPI.getWishlist,
    enabled: activeTab === 'wishlist'
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: userAPI.getNotifications,
    enabled: activeTab === 'notifications'
  });

  useEffect(() => {
    if (user) {
      emit('join-user', user.id);
    }
  }, [user, emit]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6C63FF&color=fff`}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-primary/20 rounded-full text-xs">
                  {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                </span>
              </div>
              
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-red-500">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">Welcome back, {user?.name}!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="glass p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-neon">12</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-neon">$2,499</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="text-2xl font-bold text-neon">Jan 2024</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <div className="flex-1">
                          <p className="text-sm">Order #ORD-{2024000 + i} was delivered</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">My Orders</h2>
                  <div className="space-y-4">
                    {orders?.data?.map((order) => (
                      <div key={order.id} className="glass p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">Order #{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Total: ${order.total}</p>
                          <button className="text-neon text-sm hover:underline">Track Order</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">My Wishlist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist?.data?.map((product) => (
                      <div key={product.id} className="flex gap-4 glass p-4 rounded-xl">
                        <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-neon font-bold">${product.price}</p>
                          <button className="text-sm text-neon mt-2">Add to Cart</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">Notifications</h2>
                  <div className="space-y-3">
                    {notifications?.data?.map((notif) => (
                      <div key={notif.id} className={`p-4 glass rounded-xl ${!notif.read ? 'border-l-2 border-neon' : ''}`}>
                        <p className="font-semibold">{notif.title}</p>
                        <p className="text-sm text-gray-400">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(notif.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">Saved Addresses</h2>
                  <div className="glass p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Home Address</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {user?.address?.street}<br />
                          {user?.address?.city}, {user?.address?.zipCode}<br />
                          {user?.address?.country}
                        </p>
                      </div>
                      <button className="text-neon text-sm">Edit</button>
                    </div>
                  </div>
                  <button className="btn-secondary w-full mt-4 py-2">Add New Address</button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-display font-bold gradient-text mb-6">Account Settings</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        placeholder="Add phone number"
                        className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                      />
                    </div>
                    <button className="btn-primary">Save Changes</button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;