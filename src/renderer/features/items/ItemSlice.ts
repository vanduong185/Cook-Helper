import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { ItemDTO } from '../../dto/ItemDTO';

export const addItem = createAsyncThunk(
  'item/add',
  async (item: ItemDTO): Promise<ItemDTO> => {
    const newItem = (await ipcRenderer.invoke('item-add', item)) as ItemDTO;
    return newItem;
  },
);

export const getItems = createAsyncThunk(
  'item/getAll',
  async (): Promise<ItemDTO[]> => {
    const itemsData = (await ipcRenderer.invoke('item-get-all')) as ItemDTO[];
    return itemsData;
  },
);

export const updateItem = createAsyncThunk(
  'item/update',
  async (item: ItemDTO): Promise<ItemDTO> => {
    const updatedItem = (await ipcRenderer.invoke(
      'item-update',
      item,
    )) as ItemDTO;
    return updatedItem;
  },
);

export const deleteItem = createAsyncThunk(
  'item/delete',
  async (item: ItemDTO): Promise<ItemDTO> => {
    const deletedItem = (await ipcRenderer.invoke(
      'item-delete',
      item,
    )) as ItemDTO;
    return deletedItem;
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
    [updateItem.fulfilled.toString()]: (state, action): void => {
      const updatedItem = action.payload as ItemDTO;
      const index = state.findIndex((i) => i.id === updatedItem.id);
      state[index] = updatedItem;
    },
    [deleteItem.fulfilled.toString()]: (state, action): void => {
      const deletedItem = action.payload as ItemDTO;
      const index = state.findIndex((i) => i.id === deletedItem.id);
      state.splice(index, 1);
    },
  },
});

export const ItemReducer = itemSlice.reducer;
