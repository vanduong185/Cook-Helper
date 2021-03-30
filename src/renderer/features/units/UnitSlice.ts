import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { UnitDTO } from '../../dto/UnitDTO';

export const getUnits = createAsyncThunk('unit/getAll', async () => {
  const unitsData = (await ipcRenderer.invoke('unit-get-all')) as UnitDTO[];
  return unitsData;
});

export const addUnit = createAsyncThunk(
  'unit/add',
  async (unit: UnitDTO): Promise<UnitDTO> => {
    const newUnit = (await ipcRenderer.invoke('unit-add', unit)) as UnitDTO;
    return newUnit;
  },
);

export const updateUnit = createAsyncThunk(
  'unit/update',
  async (unit: UnitDTO): Promise<UnitDTO> => {
    const updatedUnit = (await ipcRenderer.invoke(
      'unit-update',
      unit,
    )) as UnitDTO;
    return updatedUnit;
  },
);

const initUnits: UnitDTO[] = [];

const unitSlice = createSlice({
  name: 'unit',
  initialState: initUnits,
  reducers: {},
  extraReducers: {
    [getUnits.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
    [addUnit.fulfilled.toString()]: (state, action): void => {
      state.push(action.payload);
    },
    [updateUnit.fulfilled.toString()]: (state, action): void => {
      const updatedUnit = action.payload as UnitDTO;
      const index = state.findIndex((i) => i.id === updatedUnit.id);
      state[index] = updatedUnit;
    },
  },
});

export const UnitReducer = unitSlice.reducer;
