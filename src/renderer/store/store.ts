import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import { NavbarReducer } from '../components/layout/NavbarSlice';
import { CookTypeReducer } from '../features/cook-types/CookTypeSlice';
import { DishReducer } from '../features/dishes/DishSlice';
import { ItemReducer } from '../features/items/ItemSlice';
import { PartyReducer } from '../features/party/PartySlice';
import { ToolReducer } from '../features/tools/ToolSlice';
import { UnitReducer } from '../features/units/UnitSlice';

export const rootReducer = combineReducers({
  navbar: NavbarReducer,
  items: ItemReducer,
  units: UnitReducer,
  tools: ToolReducer,
  cookTypes: CookTypeReducer,
  dishes: DishReducer,
  partyMenus: PartyReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
