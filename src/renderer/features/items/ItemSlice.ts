import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { ItemDTO } from '../../dto/ItemDTO';

export const addItem = createAsyncThunk(
  'item/addItem',
  async (item: ItemDTO): Promise<ItemDTO> => {
    const newItem = (await ipcRenderer.invoke('item-add', item)) as ItemDTO;

    return newItem;
  },
);

export const getItems = createAsyncThunk(
  'item/getItems',
  async (): Promise<ItemDTO[]> => {
    const itemsData = (await ipcRenderer.invoke('item-get-all')) as ItemDTO[];

    return itemsData;
  },
);

const initItems: ItemDTO[] = [];

const itemSlice = createSlice({
  name: 'item',
  initialState: initItems,
  reducers: {},
  extraReducers: {
    [getItems.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
    [addItem.fulfilled.toString()]: (state, action): void => {
      state.push(action.payload);
    },
  },
});

export const ItemReducer = itemSlice.reducer;
