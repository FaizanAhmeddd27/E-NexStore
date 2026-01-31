// src/redux/thunks/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/signup', userData);
      toast.success(data.message);

      // Persist token client-side for environments that block third-party cookies (mobile Safari, etc.)
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/login', credentials);
      toast.success(data.message);

      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/logout');
      toast.success(data.message);

      // Clear stored token and Authorization header
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/auth/profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/refresh-token');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);