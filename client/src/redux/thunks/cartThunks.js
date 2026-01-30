import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/cart');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post('/cart', { productId });
      toast.success(data.message);
      // Refresh cart items
      dispatch(getCartItems());
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/cart/${productId}`);
      toast.success(data.message);
      // Refresh cart items
      dispatch(getCartItems());
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/cart/${productId}`, { quantity });
      // Refresh cart items
      dispatch(getCartItems());
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/cart/clear');
      toast.success(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/payment/validate-coupon', { code });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid coupon';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);