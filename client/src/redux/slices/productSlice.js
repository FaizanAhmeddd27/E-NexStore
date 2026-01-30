import { createSlice } from '@reduxjs/toolkit';
import {
  getAllProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeaturedProduct,
} from '../thunks/productThunks';

const initialState = {
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get All Products
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Products by Category
    builder.addCase(getProductsByCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    });
    builder.addCase(getProductsByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Featured Products
    builder.addCase(getFeaturedProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFeaturedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.featuredProducts = action.payload.products || [];
    });

    // Get Recommended Products
    builder.addCase(getRecommendedProducts.fulfilled, (state, action) => {
      state.recommendedProducts = action.payload.products || [];
    });

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload.product);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload.product._id);
      if (index !== -1) {
        state.products[index] = action.payload.product;
      }
    });

    // Delete Product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload.productId);
    });

    // Toggle Featured
    builder.addCase(toggleFeaturedProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload.product._id);
      if (index !== -1) {
        state.products[index] = action.payload.product;
      }
    });
  },
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;