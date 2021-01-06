import { ipcMain } from 'electron';
import { Database } from '../database/Database';
import { CookType } from '../database/models/CookType';
import { Dish } from '../database/models/Dish';
import { DishRecipe } from '../database/models/DishRecipe';
import { DishTool } from '../database/models/DishTool';
import { Item } from '../database/models/Item';
import { Tool } from '../database/models/Tool';
import { Unit } from '../database/models/Unit';

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

        const dishesData = await dishRepo
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
          .leftJoinAndMapOne(
            'dishRecipe.item',
            Item,
            'item',
            'item.id = dishRecipe.itemId',
          )
          .leftJoinAndMapOne('item.unit', Unit, 'unit', 'item.unitId = unit.id')
          .leftJoinAndMapMany(
            'dish.dishTools',
            DishTool,
            'dishTool',
            'dish.id = dishTool.dishId',
          )
          .leftJoinAndMapOne(
            'dishTool.tool',
            Tool,
            'tool',
            'tool.id = dishTool.toolId',
          )
          .leftJoinAndMapOne(
            'tool.unit',
            Unit,
            'unit2',
            'tool.unitId = unit2.id',
          )
          .getMany();

        return dishesData;
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

        return newDish;
      },
    );

    ipcMain.handle(
      'dish-update',
      async (_event, dish: Dish): Promise<boolean> => {
        const dishRepo = this.database.connection.getRepository(Dish);

        await dishRepo
          .createQueryBuilder()
          .update(Dish)
          .set({
            name: dish.name,
            mainIngredient: dish.mainIngredient,
            cookType: dish.cookType,
            cost: dish.cost,
          })
          .where('id = :id', { id: dish.id })
          .execute();

        // delete all recipes and add new recipes
        const dishRecipeRepo = this.database.connection.getRepository(
          DishRecipe,
        );
        await dishRecipeRepo
          .createQueryBuilder()
          .delete()
          .from(DishRecipe)
          .where('dishId = :dishId', { dishId: dish.id })
          .execute();
        dish.dishRecipes.forEach(async (recipe) => {
          recipe.dish = dish;
          recipe.dishId = dish.id;
          recipe.itemId = recipe.item.id;

          await dishRecipeRepo.save(recipe);
        });

        // delete all tools and add new tools
        const dishToolRepo = this.database.connection.getRepository(DishTool);
        await dishToolRepo
          .createQueryBuilder()
          .delete()
          .from(DishTool)
          .where('dishId = :dishId', { dishId: dish.id })
          .execute();
        dish.dishTools.forEach(async (dishTool) => {
          dishTool.dish = dish;
          dishTool.dishId = dish.id;
          dishTool.toolId = dishTool.tool.id;

          await dishToolRepo.save(dishTool);
        });

        return true;
      },
    );

    ipcMain.handle(
      'dish-delete',
      async (_event, dish: Dish): Promise<Dish> => {
        const dishRecipeRepo = this.database.connection.getRepository(
          DishRecipe,
        );
        await dishRecipeRepo
          .createQueryBuilder()
          .delete()
          .from(DishRecipe)
          .where('dishId = :dishId', { dishId: dish.id })
          .execute();

        const dishToolRepo = this.database.connection.getRepository(DishTool);
        await dishToolRepo
          .createQueryBuilder()
          .delete()
          .from(DishTool)
          .where('dishId = :dishId', { dishId: dish.id })
          .execute();

        const dishRepo = this.database.connection.getRepository(Dish);
        await dishRepo
          .createQueryBuilder()
          .delete()
          .from(Dish)
          .where('id = :id', { id: dish.id })
          .execute();

        return dish;
      },
    );
  }
}
