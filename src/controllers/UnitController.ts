import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { Unit } from '../database/models/Unit';

export class UnitController {
  database: Database;

  constructor() {
    this.database = global.database;
    this.init();
  }

  init(): void {
    ipcMain.handle(
      'unit-get-all',
      async (): Promise<Unit[]> => {
        const unitRepo = this.database.connection.getRepository(Unit);
        const units = await unitRepo.find();
        return units;
      },
    );
  }
}
