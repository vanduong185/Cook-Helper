import { Connection, createConnection } from 'typeorm';
import { Item } from './models/Item';

export class Database {
  private connection: Connection;

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    this.connection = await createConnection({
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: './assets/database.sqlite',
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
