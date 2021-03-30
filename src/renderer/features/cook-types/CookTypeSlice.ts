import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { CookTypeDTO } from '../../dto/CookTypeDTO';

export const getCookTypes = createAsyncThunk('cooktype/getAll', async () => {
  const cookTypesData = (await ipcRenderer.invoke(
    'cooktype-get-all',
  )) as CookTypeDTO[];
  return cookTypesData;
});

export const addCookType = createAsyncThunk(
  'cooktype/add',
  async (cookType: CookTypeDTO): Promise<CookTypeDTO> => {
    const newCookType = (await ipcRenderer.invoke(
      'cooktype-add',
      cookType,
    )) as CookTypeDTO;
    return newCookType;
  },
);

export const updateCookType = createAsyncThunk(
  'cooktype/update',
  async (cookType: CookTypeDTO): Promise<CookTypeDTO> => {
    const updatedCookType = (await ipcRenderer.invoke(
      'cooktype-update',
      cookType,
    )) as CookTypeDTO;
    return updatedCookType;
  },
);

const initCookTypes: CookTypeDTO[] = [];

const cookTypeSlice = createSlice({
  name: 'cooktype',
  initialState: initCookTypes,
  reducers: {},
  extraReducers: {
    [getCookTypes.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
    [addCookType.fulfilled.toString()]: (state, action): void => {
      state.push(action.payload);
    },
    [updateCookType.fulfilled.toString()]: (state, action): void => {
      const updatedCookType = action.payload as CookTypeDTO;
      const index = state.findIndex((i) => i.id === updatedCookType.id);
      state[index] = updatedCookType;
    },
  },
});

export const CookTypeReducer = cookTypeSlice.reducer;
