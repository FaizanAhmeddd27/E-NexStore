import { createSlice } from '@reduxjs/toolkit';
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  validateCoupon,
} from '../thunks/cartThunks';

const initialState = {
  cartItems: [],
  coupon: null,
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotals: (state) => {
      let subtotal = 0;
      
      state.cartItems.forEach(item => {
        if (item.product) {
          subtotal += item.product.price * item.quantity;
        }
      });

      state.subtotal = subtotal;
      
      if (state.coupon) {
        const discount = subtotal * (state.coupon.discountPercentage / 100);
        state.total = subtotal - discount;
      } else {
        state.total = subtotal;
      }
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.total = state.subtotal;
    },
    // Synchronously clear only the client-side cart (used after redirect back from Stripe)
    clearLocalCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.subtotal = 0;
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    // Get Cart Items
    builder.addCase(getCartItems.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.cartItems || [];
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      // Refresh cart items after adding
    });

    // Remove from Cart
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      // Refresh cart items after removing
    });

    // Update Quantity
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      // Refresh cart items after updating
    });

    // Clear Cart
    builder.addCase(clearCart.fulfilled, (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.subtotal = 0;
      state.total = 0;
    });

    // Validate Coupon
    builder.addCase(validateCoupon.fulfilled, (state, action) => {
      state.coupon = action.payload;
    });
    builder.addCase(validateCoupon.rejected, (state) => {
      state.coupon = null;
    });
  },
});

export const { calculateTotals, removeCoupon, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;