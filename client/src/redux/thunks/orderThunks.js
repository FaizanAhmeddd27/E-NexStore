import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const getOrderHistory = createAsyncThunk(
  'orders/getOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/payment/orders');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/payment/orders/${orderId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
