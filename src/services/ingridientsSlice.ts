import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from './store';

export type TingridientsState = {
  ingridients: TIngredient[];
  isloading: boolean;
  error: null | string;
};

const initialState: TingridientsState = {
  ingridients: [],
  isloading: false,
  error: null
};

export const fetchIngridients = createAsyncThunk<TIngredient[], void>(
  'ingridients/fetchIngridients',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getIngredientsByID = (state: RootState, id: string) =>
  state.ingridients.ingridients.find((i) => i._id === id);

const ingridientsSlice = createSlice({
  name: 'ingridients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngridients.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(fetchIngridients.fulfilled, (state, action) => {
        state.isloading = false;
        state.ingridients = action.payload;
      })
      .addCase(fetchIngridients.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.error.message as string;
      });
  }
});

export default ingridientsSlice.reducer;
