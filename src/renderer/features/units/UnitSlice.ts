import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { UnitDTO } from '../../dto/UnitDTO';

export const getUnits = createAsyncThunk('unit/getAll', async () => {
  const unitsData = (await ipcRenderer.invoke('unit-get-all')) as UnitDTO[];

  return unitsData;
});

const initUnits: UnitDTO[] = [];

const unitSlice = createSlice({
  name: 'item',
  initialState: initUnits,
  reducers: {},
  extraReducers: {
    [getUnits.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
  },
});

export const UnitReducer = unitSlice.reducer;
