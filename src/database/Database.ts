import path from 'path';
import { app } from 'electron';
import { Connection, createConnection } from 'typeorm';
import { Item } from './models/Item';
import { Unit } from './models/Unit';
import { Tool } from './models/Tool';
import { DishRecipe } from './models/DishRecipe';
import { DishTool } from './models/DishTool';
import { CookType } from './models/CookType';
import { Dish } from './models/Dish';
import { Menu } from './models/Menu';

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
      entities: [Unit, Item, Tool, CookType, Dish, DishRecipe, DishTool, Menu],
    });
  }

  public async seed(): Promise<void> {
    // units
    const unitData: string[] = ['gam', 'kg', 'ml', 'lit', 'chiếc'];
    const unitRepo = this.connection.getRepository(Unit);
    unitData.forEach((unitName: string): void => {
      const unit = new Unit();
      unit.name = unitName;

      unitRepo.save(unit);
    });

    // cook types
    const cookTypeData: string[] = [
      'nướng',
      'hấp',
      'chiên',
      'xào',
      'canh',
      'súp',
      'hầm',
      'nộm',
      'rau',
      'tráng miệng',
      'đồ nếp tẻ',
      'gỏi cuốn',
      'đồ uống',
    ];
    const cookTypeRepo = this.connection.getRepository(CookType);
    cookTypeData.forEach((typeName: string): void => {
      const cookType = new CookType();
      cookType.name = typeName;

      cookTypeRepo.save(cookType);
    });
  }

  public async fetchAllUnit(): Promise<Unit[]> {
    const unitRepo = this.connection.getRepository(Unit);

    return await unitRepo.find();
  }

  public async fetchAllCookType(): Promise<CookType[]> {
    const cookTypeRepo = this.connection.getRepository(CookType);

    return await cookTypeRepo.find();
  }

  public async addItem(item: Item): Promise<Item> {
    const itemRepo = this.connection.getRepository(Item);
    // const tmpItem = new Item();
    // tmpItem.name = item.name;
    // tmpItem.provider = item.provider;

    return itemRepo.save(item);
  }

  public async fetchAllItem(): Promise<Item[]> {
    const itemRepo = this.connection.getRepository(Item);

    return await itemRepo.find({
      relations: ['unit'],
    });
  }
}
