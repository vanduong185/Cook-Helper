import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { CookType } from '../database/models/CookType';
import { Dish } from '../database/models/Dish';
import { DishRecipe } from '../database/models/DishRecipe';
import { DishTool } from '../database/models/DishTool';
import { Item } from '../database/models/Item';
import { Tool } from '../database/models/Tool';

export class DishController {
  database: Database;

  constructor() {
    this.database = global.database;
    this.init();
  }

  init(): void {
    ipcMain.handle(
      'dish-get-all',
      async (): Promise<Dish[]> => {
        const dishRepo = this.database.connection.getRepository(Dish);

        const data = await dishRepo
          .createQueryBuilder('dish')
          .leftJoinAndMapOne(
            'dish.cookType',
            CookType,
            'cookType',
            'dish.cookTypeId = cookType.id',
          )
          .leftJoinAndMapMany(
            'dish.dishRecipes',
            DishRecipe,
            'dishRecipe',
            'dish.id = dishRecipe.dishId',
          )
          .leftJoinAndMapMany(
            'dishRecipe.item',
            Item,
            'item',
            'item.id = dishRecipe.itemId',
          )
          .leftJoinAndMapMany(
            'dish.dishTools',
            DishTool,
            'dishTool',
            'dish.id = dishTool.dishId',
          )
          .leftJoinAndMapMany(
            'dishTool.tool',
            Tool,
            'tool',
            'tool.id = dishTool.toolId',
          )
          .getMany();

        console.log(data);

        return data;
      },
    );

    ipcMain.handle(
      'dish-add',
      async (_event, dish: Dish): Promise<Dish> => {
        const dishRepo = this.database.connection.getRepository(Dish);
        const newDish = await dishRepo.save(dish);

        const dishRecipeRepo = this.database.connection.getRepository(
          DishRecipe,
        );
        dish.dishRecipes.forEach(async (recipe) => {
          recipe.dish = newDish;
          recipe.dishId = newDish.id;
          recipe.itemId = recipe.item.id;

          await dishRecipeRepo.save(recipe);
        });

        const dishToolRepo = this.database.connection.getRepository(DishTool);
        dish.dishTools.forEach(async (dishTool) => {
          dishTool.dish = newDish;
          dishTool.dishId = newDish.id;
          dishTool.toolId = dishTool.tool.id;

          await dishToolRepo.save(dishTool);
        });

        dish.id = newDish.id;
        return dish;
      },
    );
  }
}
