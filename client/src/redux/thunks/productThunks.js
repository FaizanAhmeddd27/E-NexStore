// src/redux/thunks/productThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products/category/${category}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/featured');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getRecommendedProducts = createAsyncThunk(
  'products/getRecommendedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/recommendations');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/products/${productId}`);
      toast.success(data.message);
      return { ...data, productId };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const toggleFeaturedProduct = createAsyncThunk(
  'products/toggleFeaturedProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/products/${productId}/toggle-featured`);
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle featured';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);