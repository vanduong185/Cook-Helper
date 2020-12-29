import { app } from 'electron';
import { Connection, createConnection } from 'typeorm';
import { Item } from './models/Item';
import path from 'path';

export class Database {
  private connection: Connection;

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    // store database.sqlite at USER_DATA folder
    const userDataPath = app.getPath('userData');
    const databasePath = path.join(userDataPath, 'database.sqlite');

    this.connection = await createConnection({
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: databasePath,
      entities: [Item],
    });
  }

  public async insert(name: string): Promise<Item> {
    const itemRepository = this.connection.getRepository(Item);
    const item = new Item();
    item.name = name;

    return itemRepository.save(item);
  }

  public async fetchAll(): Promise<Item[]> {
    const itemRepository = this.connection.getRepository(Item);

    return await itemRepository.find();
  }
}
