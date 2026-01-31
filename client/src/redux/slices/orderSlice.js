import { createSlice } from '@reduxjs/toolkit';
import { getOrderHistory, getOrderDetails } from '../thunks/orderThunks';
import { logout } from '../thunks/authThunks';

const initialState = {
  orders: [],
  count: 0,
  loading: false,
  error: null,
  currentOrder: null,
  currentLoading: false,
  currentError: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrderHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders || [];
      state.count = action.payload.count ?? state.orders.length;
    });
    builder.addCase(getOrderHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch orders';
    });

    // Get single order
    builder.addCase(getOrderDetails.pending, (state) => {
      state.currentLoading = true;
      state.currentError = null;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.currentLoading = false;
      state.currentOrder = action.payload.order || null;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.currentLoading = false;
      state.currentError = action.payload || 'Failed to fetch order details';
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.orders = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
      state.currentOrder = null;
      state.currentLoading = false;
      state.currentError = null;
    });
  },
});

export default orderSlice.reducer; 
