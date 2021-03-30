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

    ipcMain.handle(
      'cooktype-add',
      async (_event, cookType: CookType): Promise<CookType> => {
        const cookTypeRepo = this.database.connection.getRepository(CookType);
        const newCookType = await cookTypeRepo.save(cookType);
        return newCookType;
      },
    );

    ipcMain.handle(
      'cooktype-update',
      async (_event, cookType: CookType): Promise<CookType> => {
        const cookTypeRepo = this.database.connection.getRepository(CookType);

        await cookTypeRepo
          .createQueryBuilder()
          .update(CookType)
          .set({
            ...cookType,
          })
          .where('id = :id', { id: cookType.id })
          .execute();

        return cookType;
      },
    );
  }
}
