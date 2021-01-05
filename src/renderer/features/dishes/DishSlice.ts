import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { DishDTO } from '../../dto/DishDTO';

export const addDish = createAsyncThunk(
  'dish/add',
  async (dish: DishDTO): Promise<DishDTO> => {
    const newDish = (await ipcRenderer.invoke('dish-add', dish)) as DishDTO;
    dish.id = newDish.id;
    return dish;
  },
);

export const getDishes = createAsyncThunk(
  'dish/getAll',
  async (): Promise<DishDTO[]> => {
    const dishesData = (await ipcRenderer.invoke('dish-get-all')) as DishDTO[];
    return dishesData;
  },
);

const initDishes: DishDTO[] = [];
const dishSlice = createSlice({
  name: 'dish',
  initialState: initDishes,
  reducers: {},
  extraReducers: {
    [getDishes.fulfilled.toString()]: (state, action): DishDTO[] => {
      return action.payload;
    },
    [addDish.fulfilled.toString()]: (state, action): void => {
      state.push(action.payload as DishDTO);
    },
  },
});

export const DishReducer = dishSlice.reducer;
