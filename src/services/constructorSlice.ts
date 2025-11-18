import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

type TConstructorIngridient = TIngredient & { id: string };

type TConstructorType = {
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
      const newIngridients: TConstructorIngridient = {
        ...action.payload,
        id: uuid()
      };

      if (newIngridients.type === 'bun') {
        state.bun = newIngridients;
      } else {
        state.ingredients.push(newIngridients);
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
    }
  }
});

export const { addIngredient, removeIngridient, moveIngridient } =
  constructorSlice.actions;
export default constructorSlice.reducer;
