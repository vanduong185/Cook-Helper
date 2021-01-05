import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { CookTypeDTO } from '../../dto/CookTypeDTO';

export const getCookTypes = createAsyncThunk('cooktype/getAll', async () => {
  const cookTypesData = (await ipcRenderer.invoke(
    'cooktype-get-all',
  )) as CookTypeDTO[];
  return cookTypesData;
});

const initCookTypes: CookTypeDTO[] = [];

const cookTypeSlice = createSlice({
  name: 'cooktype',
  initialState: initCookTypes,
  reducers: {},
  extraReducers: {
    [getCookTypes.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
  },
});

export const CookTypeReducer = cookTypeSlice.reducer;
