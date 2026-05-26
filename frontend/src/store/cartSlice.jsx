import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  appliedCoupon: null,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      return { ...state, ...action.payload };
    },
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product.id,
          product: product,
          quantity,
          price: product.price,
        });
      }
      
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.total = state.subtotal - state.discount;
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.productId !== productId);
        }
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        state.total = state.subtotal - state.discount;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.total = state.subtotal - state.discount;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem('cart');
    },
    applyCoupon: (state, action) => {
      const { discount, code } = action.payload;
      state.discount = discount;
      state.total = state.subtotal - discount;
      state.appliedCoupon = code;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCoupon: (state) => {
      state.discount = 0;
      state.total = state.subtotal;
      state.appliedCoupon = null;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    loadCartFromStorage: (state) => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
      return state;
    },
  },
});

export const { 
  setCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  applyCoupon, 
  removeCoupon,
  loadCartFromStorage 
} = cartSlice.actions;
export default cartSlice.reducer;