import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Action } from '@remix-run/router';
import { TOrder, TOrdersData } from '@utils-types';

interface feedState extends TOrdersData {
  orders: TOrder[];
  total: number;
  totalToday: number;
  ordersAuth: TOrder[];
  isLoading: boolean;
  error: null | string;
}

const initialState: feedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  ordersAuth: [],
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: any }
>('feed/fetchFeed', async (_, thunkApi) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

export const fetchOrdersCurentUser = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: any }
>('feed/fetchOrdersCurentUser', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      })
      .addCase(fetchOrdersCurentUser.pending, (state) => {
        state.ordersAuth = [];
      })
      .addCase(fetchOrdersCurentUser.fulfilled, (state, action) => {
        state.ordersAuth = action.payload;
      });
  }
});

export default feedSlice.reducer;
