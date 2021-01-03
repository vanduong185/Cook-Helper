import { configureStore } from '@reduxjs/toolkit';
import { NavbarReducer } from '../components/layout/NavbarSlice';

const rootReducer = {
  navbar: NavbarReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});
