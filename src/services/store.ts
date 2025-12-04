import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import IngridientsReducer from './ingridientsSlice';
import FeedReducer from './feedSlice';
import UserReducer from './userSlice';
import ConstructorReducer from './constructorSlice';
import OrderReducer from './orderSlice';

const rootReducer = combineReducers({
  ingridients: IngridientsReducer,
  feed: FeedReducer,
  user: UserReducer,
  burgerConstructor: ConstructorReducer,
  order: OrderReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
