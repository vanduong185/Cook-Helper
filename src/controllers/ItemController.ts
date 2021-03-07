import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { DishRecipe } from '../database/models/DishRecipe';
import { Item } from '../database/models/Item';
import { Unit } from '../database/models/Unit';

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
        // create new unit if it not exist
        if (!item.unit.id) {
          const unitRepo = this.database.connection.getRepository(Unit);
          const newUnit = await unitRepo.save(item.unit);
          item.unit = newUnit;
        }

        const itemRepo = this.database.connection.getRepository(Item);
        const newItem = await itemRepo.save(item);
        return newItem;
      },
    );

    ipcMain.handle(
      'item-update',
      async (_event, item: Item): Promise<Item> => {
        // create new unit if it not exist
        if (!item.unit.id) {
          const unitRepo = this.database.connection.getRepository(Unit);
          const newUnit = await unitRepo.save(item.unit);
          item.unit = newUnit;
        }

        const itemRepo = this.database.connection.getRepository(Item);

        await itemRepo
          .createQueryBuilder()
          .update(Item)
          .set({
            ...item,
          })
          .where('id = :id', { id: item.id })
          .execute();

        return item;
      },
    );

    ipcMain.handle(
      'item-delete',
      async (_event, item: Item): Promise<Item> => {
        const dishRecipeRepo = this.database.connection.getRepository(
          DishRecipe,
        );
        await dishRecipeRepo
          .createQueryBuilder()
          .delete()
          .from(DishRecipe)
          .where('itemId = :itemId', { itemId: item.id })
          .execute();

        const itemRepo = this.database.connection.getRepository(Item);
        await itemRepo
          .createQueryBuilder()
          .delete()
          .from(Item)
          .where('id = :id', { id: item.id })
          .execute();

        return item;
      },
    );
  }
}
