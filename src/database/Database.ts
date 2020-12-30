import path from 'path';
import { app } from 'electron';
import { Connection, createConnection } from 'typeorm';
import { Item } from './models/Item';
import { Unit } from './models/Unit';
import { Tool } from './models/Tool';

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
      entities: [Unit, Item, Tool],
    });
  }

  public async insertUnit(name: string): Promise<Unit> {
    const unitRepo = this.connection.getRepository(Unit);
    const unit = new Unit();
    unit.name = name;

    return unitRepo.save(unit);
  }

  public async fetchAllUnit(): Promise<Unit[]> {
    const unitRepo = this.connection.getRepository(Unit);

    return await unitRepo.find();
  }

  public async insert(name: string): Promise<Item> {
    const itemRepository = this.connection.getRepository(Item);
    const item = new Item();
    item.name = name;
    item.provider = 'market';

    const unitRepo = this.connection.getRepository(Unit);
    const units = await unitRepo.find({ where: { id: 1 } });
    item.unit = units[0];

    return itemRepository.save(item);
  }

  public async fetchAll(): Promise<Item[]> {
    const itemRepository = this.connection.getRepository(Item);

    return await itemRepository.find({ relations: ['unit'] });
  }
}
