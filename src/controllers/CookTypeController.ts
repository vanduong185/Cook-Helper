import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { CookType } from '../database/models/CookType';

export class CookTypeController {
  database: Database;

  constructor() {
    this.database = global.database;
    this.init();
  }

  init(): void {
    ipcMain.handle(
      'cooktype-get-all',
      async (): Promise<CookType[]> => {
        const cookTypeRepo = this.database.connection.getRepository(CookType);
        const cookTypes = await cookTypeRepo.find();
        return cookTypes;
      },
    );
  }
}
