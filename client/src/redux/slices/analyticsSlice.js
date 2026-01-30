import { createSlice } from '@reduxjs/toolkit';
import { getAnalytics } from '../thunks/analyticsThunks';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAnalytics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.analytics;
    });
    builder.addCase(getAnalytics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default analyticsSlice.reducer;