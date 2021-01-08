import { createSlice } from '@reduxjs/toolkit';
import { MenuDTO } from '../../dto/MenuDTO';

const initMenus: MenuDTO[] = [];
const partySlice = createSlice({
  name: 'party',
  initialState: initMenus,
  reducers: {
    addMenuToParty: (state, action): void => {
      state.push(action.payload as MenuDTO);
    },
    removeMenuFromParty: (state, action): void => {
      const index = action.payload as number;
      state.splice(index, 1);
    },
    updateMenuFromParty: (state, action): void => {
      const menu = action.payload.menu as MenuDTO;
      const index = action.payload.index as number;
      state[index] = menu;
    },
    resetMenuFromParty: (): MenuDTO[] => initMenus,
  },
});

export const {
  addMenuToParty,
  removeMenuFromParty,
  updateMenuFromParty,
  resetMenuFromParty,
} = partySlice.actions;
export const PartyReducer = partySlice.reducer;
