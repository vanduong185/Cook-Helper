import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { Item } from '../database/models/Item';

export class ItemController {
  database: Database;
  constructor() {
    this.database = global.database;
    this.init();
  }

  init(): void {
    ipcMain.handle(
      'item-get-all',
      async (): Promise<Item[]> => {
        const itemRepo = this.database.connection.getRepository(Item);
        const items = await itemRepo.find({
          relations: ['unit'],
        });
        return items;
      },
    );

    ipcMain.handle(
      'item-add',
      async (_event, item: Item): Promise<Item> => {
        const itemRepo = this.database.connection.getRepository(Item);
        const newItem = await itemRepo.save(item);
        return newItem;
      },
    );

    ipcMain.handle(
      'item-update',
      async (_event, item: Item): Promise<Item> => {
        const itemRepo = this.database.connection.getRepository(Item);
        // const item = await itemRepo.find({
        //   where: {id: item.id}
        // });

        const result = await itemRepo
          .createQueryBuilder()
          .update(Item)
          .set({
            ...item,
          })
          .where('id = :id', { id: item.id })
          .execute();

        console.log(result.raw);

        return item;
      },
    );
  }
}
