import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { clearCart } from '../store/cartSlice';
import { orderAPI } from '../services/api';
import { FiCreditCard, FiTruck, FiMapPin, FiSmartphone, FiMail, FiUser } from 'react-icons/fi';

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: user?.address?.street || '',
      city: user?.address?.city || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'USA',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(async () => {
      try {
        const orderData = {
          shippingAddress: {
            fullName: data.fullName,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
            country: data.country,
            phone: data.phone
          },
          paymentMethod: paymentMethod,
          items: items,
          total: total
        };
        
        // In production, send to backend
        // const response = await orderAPI.createOrder(orderData);
        
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Order failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      {...register('zipCode', { required: 'Zip code is required' })}
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    >
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    placeholder="Optional"
                  />
                </div>
              </form>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <FiCreditCard className="text-secondary" />
                </div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 glass rounded-xl cursor-pointer hover:border-neon transition">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Credit / Debit Card</div>
                    <div className="text-sm text-gray-400">Visa, Mastercard, American Express</div>
                  </div>
                  <FiCreditCard className="text-2xl text-gray-400" />
                </label>
                
                <label className="flex items-center p-4 glass rounded-xl cursor-pointer hover:border-neon transition">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">PayPal</div>
                    <div className="text-sm text-gray-400">Fast and secure</div>
                  </div>
                  <span className="text-2xl text-gray-400">P</span>
                </label>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      {...register('cardNumber')}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        {...register('expiryDate')}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        {...register('cvv')}
                        placeholder="123"
                        type="password"
                        className="w-full px-4 py-3 glass rounded-xl outline-none focus:border-neon transition"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-neon">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isProcessing}
                className="btn-primary w-full mt-6 py-3 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;