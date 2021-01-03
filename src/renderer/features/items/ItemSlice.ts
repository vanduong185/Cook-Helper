import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { remote } from 'electron';
import { Database } from '../../../database/Database';
import { ItemDTO } from '../../dto/ItemDTO';
import { Item } from '../../../database/models/Item';
import { Unit } from '../../../database/models/Unit';

export const addItem = createAsyncThunk(
  'item/addItem',
  async (itemDTO: ItemDTO) => {
    const database = remote.getGlobal('database') as Database;

    const item: Item = new Item();
    item.name = itemDTO.name;
    item.provider = itemDTO.provider;
    item.unit = new Unit();
    item.unit.id = itemDTO.unit.id;

    const newItem = await database.addItem(item);
    itemDTO.id = newItem.id;

    return itemDTO;
  },
);

export const getItems = createAsyncThunk('item/getItems', async () => {
  const database = remote.getGlobal('database') as Database;
  const data = await database.fetchAllItem();

  const items: ItemDTO[] = [];
  data.forEach((itemData) => {
    items.push({
      id: itemData.id,
      name: itemData.name,
      provider: itemData.provider,
      unit: {
        id: itemData.unit?.id,
        name: itemData.unit?.name,
      },
    });
  });

  return items;
});

const initItems: ItemDTO[] = [];

const itemSlice = createSlice({
  name: 'item',
  initialState: initItems,
  // reducers: {
  //   addItem: (state, action): Item[] => {
  //     state.push(action.payload);
  //     return state;
  //   },
  // },
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
