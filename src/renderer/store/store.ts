import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import { NavbarReducer } from '../components/layout/NavbarSlice';
import { ItemReducer } from '../features/items/ItemSlice';
import { UnitReducer } from '../features/units/UnitSlice';

export const rootReducer = combineReducers({
  navbar: NavbarReducer,
  items: ItemReducer,
  units: UnitReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
