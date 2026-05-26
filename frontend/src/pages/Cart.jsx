import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const Cart = () => {
  const { items, subtotal, total, discount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4">Your cart is empty</h2>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 flex gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.product.name}</h3>
                  <p className="text-neon font-bold">${item.price}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                        className="p-1 rounded glass"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        className="p-1 rounded glass"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
            
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-500 hover:text-red-400"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-neon">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <button className="btn-primary w-full">Proceed to Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;