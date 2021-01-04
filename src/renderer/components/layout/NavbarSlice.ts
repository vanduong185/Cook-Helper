import { createSlice } from '@reduxjs/toolkit';

const navbar = createSlice({
  name: 'navbar',
  initialState: true,
  reducers: {
    toggleNavbar: (state, action): boolean => {
      return action.payload;
    },
  },
});

export const { toggleNavbar } = navbar.actions;
export const NavbarReducer = navbar.reducer;
