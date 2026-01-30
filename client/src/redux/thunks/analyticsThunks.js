// src/redux/thunks/analyticsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const getAnalytics = createAsyncThunk(
  'analytics/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/analytics');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);