import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { ToolDTO } from '../../dto/ToolDTO';

export const addTool = createAsyncThunk(
  'tool/add',
  async (tool: ToolDTO): Promise<ToolDTO> => {
    const newTool = (await ipcRenderer.invoke('tool-add', tool)) as ToolDTO;
    return newTool;
  },
);

export const getTools = createAsyncThunk(
  'tool/getAll',
  async (): Promise<ToolDTO[]> => {
    const toolsData = (await ipcRenderer.invoke('tool-get-all')) as ToolDTO[];
    return toolsData;
  },
);

export const updateTool = createAsyncThunk(
  'tool/update',
  async (tool: ToolDTO): Promise<ToolDTO> => {
    const updatedTool = (await ipcRenderer.invoke(
      'tool-update',
      tool,
    )) as ToolDTO;
    return updatedTool;
  },
);

export const deleteTool = createAsyncThunk(
  'tool/delete',
  async (tool: ToolDTO): Promise<ToolDTO> => {
    const deletedTool = (await ipcRenderer.invoke(
      'tool-delete',
      tool,
    )) as ToolDTO;
    return deletedTool;
  },
);

const initTools: ToolDTO[] = [];
const toolSlice = createSlice({
  name: 'tool',
  initialState: initTools,
  reducers: {},
  extraReducers: {
    [getTools.fulfilled.toString()]: (state, action): void => {
      return action.payload;
    },
    [addTool.fulfilled.toString()]: (state, action): void => {
      state.push(action.payload);
    },
    [updateTool.fulfilled.toString()]: (state, action): void => {
      const updatedTool = action.payload as ToolDTO;
      const index = state.findIndex((i) => i.id === updatedTool.id);
      state[index] = updatedTool;
    },
    [deleteTool.fulfilled.toString()]: (state, action): void => {
      const deletedTool = action.payload as ToolDTO;
      const index = state.findIndex((i) => i.id === deletedTool.id);
      state.splice(index, 1);
    },
  },
});

export const ToolReducer = toolSlice.reducer;
