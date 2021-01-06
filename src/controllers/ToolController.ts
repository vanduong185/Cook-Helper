import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { DishTool } from '../database/models/DishTool';
import { Tool } from '../database/models/Tool';

export class ToolController {
  database: Database;

  constructor() {
    this.database = global.database;
    this.init();
  }

  init(): void {
    ipcMain.handle(
      'tool-get-all',
      async (): Promise<Tool[]> => {
        const toolRepo = this.database.connection.getRepository(Tool);
        const tools = await toolRepo.find({
          relations: ['unit'],
        });
        return tools;
      },
    );

    ipcMain.handle(
      'tool-add',
      async (_event, tool: Tool): Promise<Tool> => {
        const toolRepo = this.database.connection.getRepository(Tool);
        const newTool = await toolRepo.save(tool);
        return newTool;
      },
    );

    ipcMain.handle(
      'tool-update',
      async (_event, tool: Tool): Promise<Tool> => {
        const toolRepo = this.database.connection.getRepository(Tool);

        await toolRepo
          .createQueryBuilder()
          .update(Tool)
          .set({
            ...tool,
          })
          .where('id = :id', { id: tool.id })
          .execute();

        return tool;
      },
    );

    ipcMain.handle(
      'tool-delete',
      async (_event, tool: Tool): Promise<Tool> => {
        const dishToolRepo = this.database.connection.getRepository(DishTool);
        await dishToolRepo
          .createQueryBuilder()
          .delete()
          .from(DishTool)
          .where('toolId = :toolId', { toolId: tool.id })
          .execute();

        const toolRepo = this.database.connection.getRepository(Tool);
        await toolRepo
          .createQueryBuilder()
          .delete()
          .from(Tool)
          .where('id = :id', { id: tool.id })
          .execute();

        return tool;
      },
    );
  }
}
