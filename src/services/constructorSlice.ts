import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

type TConstructorIngridient = TIngredient & { id: string };

export type TConstructorType = {
  bun: TConstructorIngridient | null;
  ingredients: TConstructorIngridient[];
};

const initialState: TConstructorType = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient(state, action) {
      const newIngredients: TConstructorIngridient = {
        ...action.payload,
        id: uuid()
      };

      if (newIngredients.type === 'bun') {
        state.bun = newIngredients;
      } else {
        state.ingredients.push(newIngredients);
      }
    },
    removeIngridient(state, action) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveIngridient(state, action) {
      const { from, to } = action.payload;

      const item = state.ingredients[from];

      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
    clearIngridient(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngridient,
  moveIngridient,
  clearIngridient
} = constructorSlice.actions;
export default constructorSlice.reducer;
