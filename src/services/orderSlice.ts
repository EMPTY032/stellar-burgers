import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Action } from '@remix-run/router';
import { TOrder } from '@utils-types';

type OrderState = {
  // создание нового заказа в конструкторе -_-
  newOrder: TOrder | null;
  newOrderRequest: boolean;

  // просмотр заказа по ID $_$
  currentOrder: TOrder | null;
  currentOrderRequest: boolean;
};

const initialState: OrderState = {
  newOrder: null,
  newOrderRequest: false,
  currentOrder: null,
  currentOrderRequest: false
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: any }
>('order/createOrder', async (ingredients: string[], { rejectWithValue }) => {
  try {
    const newOrder = await orderBurgerApi(ingredients);
    if (!newOrder?.success) {
      return rejectWithValue(newOrder);
    }
    return newOrder.order;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: any }
>('order/fetchOrderByNumber', async (id: number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(id);

    if (!data?.success || !data.orders.length) {
      return rejectWithValue(data);
    }

    return data.orders[0];
  } catch (err) {
    return rejectWithValue(err);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearNewOrder(state) {
      state.newOrder = null;
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrder.pending, (state) => {
        state.newOrderRequest = true;
        state.newOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.newOrderRequest = false;
        state.newOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.newOrderRequest = false;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderRequest = true;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderRequest = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.currentOrderRequest = false;
      })
});

export const { clearNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
