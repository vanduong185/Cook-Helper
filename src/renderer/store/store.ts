import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import { NavbarReducer } from '../components/layout/NavbarSlice';
import { ItemReducer } from '../features/items/ItemSlice';
import { ToolReducer } from '../features/tools/ToolSlice';
import { UnitReducer } from '../features/units/UnitSlice';

export const rootReducer = combineReducers({
  navbar: NavbarReducer,
  items: ItemReducer,
  units: UnitReducer,
  tools: ToolReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
