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

    ipcMain.handle(
      'unit-add',
      async (_event, unit: Unit): Promise<Unit> => {
        const unitRepo = this.database.connection.getRepository(Unit);
        const newUnit = await unitRepo.save(unit);
        return newUnit;
      },
    );

    ipcMain.handle(
      'unit-update',
      async (_event, unit: Unit): Promise<Unit> => {
        const unitRepo = this.database.connection.getRepository(Unit);

        await unitRepo
          .createQueryBuilder()
          .update(Unit)
          .set({
            ...unit,
          })
          .where('id = :id', { id: unit.id })
          .execute();

        return unit;
      },
    );
  }
}
