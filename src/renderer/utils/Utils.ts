import { MenuDTO } from '../dto/MenuDTO';
import { ItemStatsDTO } from '../dto/ItemStatsDTO';
import { ToolStatsDTO } from '../dto/ToolStatsDTO';
import { DishDTO } from '../dto/DishDTO';

export class Utils {
  static getMenuPrice(menu: MenuDTO): number {
    let totalPrice = 0;
    menu.dishes.forEach((dish) => {
      totalPrice += dish.cost;
    });

    return totalPrice;
  }

  static getItemStats(menus: MenuDTO[]): ItemStatsDTO[] {
    const totalItems: ItemStatsDTO[] = [];

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        dish.dishRecipes.forEach((recipe) => {
          const itemStats: ItemStatsDTO = {
            id: recipe.item.id,
            item: recipe.item,
            amount: recipe.amount * menu.setAmount,
          };

          const existItemStats = totalItems.find((i) => i.id === itemStats.id);
          if (existItemStats) {
            existItemStats.amount += itemStats.amount;
            return;
          }

          totalItems.push(itemStats);
        });
      });
    });

    return totalItems;
  }

  static getToolStats(menus: MenuDTO[]): ToolStatsDTO[] {
    const totalTools: ToolStatsDTO[] = [];

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        dish.dishTools.forEach((dishTool) => {
          const toolStats: ToolStatsDTO = {
            id: dishTool.tool.id,
            tool: dishTool.tool,
            amount: dishTool.amount * menu.setAmount,
          };

          const existToolStats = totalTools.find((t) => t.id === toolStats.id);
          if (existToolStats) {
            existToolStats.amount += toolStats.amount;
            return;
          }

          totalTools.push(toolStats);
        });
      });
    });

    return totalTools;
  }

  static getDishesInMenu(menus: MenuDTO[]): DishDTO[] {
    const totalDishes: DishDTO[] = [];

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        const existDish = totalDishes.find((d) => d.id === dish.id);
        if (existDish) {
          return;
        }

        totalDishes.push(dish);
      });
    });

    return totalDishes;
  }

  static getItemStatsByDishId(
    dishId: number,
    menus: MenuDTO[],
  ): ItemStatsDTO[] {
    const listItemStats: ItemStatsDTO[] = [];
    if (!dishId) {
      return listItemStats;
    }

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        if (dish.id !== dishId) {
          return;
        }

        dish.dishRecipes.forEach((recipe) => {
          const itemStats: ItemStatsDTO = {
            id: recipe.item.id,
            item: recipe.item,
            amount: recipe.amount * menu.setAmount,
          };

          const existItemStats = listItemStats.find(
            (i) => i.id === itemStats.id,
          );
          if (existItemStats) {
            existItemStats.amount += itemStats.amount;
            return;
          }

          listItemStats.push(itemStats);
        });
      });
    });

    return listItemStats;
  }

  static getToolStatsByDishId(
    dishId: number,
    menus: MenuDTO[],
  ): ToolStatsDTO[] {
    const listToolStats: ToolStatsDTO[] = [];
    if (!dishId) {
      return listToolStats;
    }

    menus.forEach((menu) => {
      menu.dishes.forEach((dish) => {
        if (dish.id !== dishId) {
          return;
        }

        dish.dishTools.forEach((dishTool) => {
          const toolStats: ToolStatsDTO = {
            id: dishTool.tool.id,
            tool: dishTool.tool,
            amount: dishTool.amount * menu.setAmount,
          };

          const existToolStats = listToolStats.find(
            (i) => i.id === toolStats.id,
          );
          if (existToolStats) {
            existToolStats.amount += toolStats.amount;
            return;
          }

          listToolStats.push(toolStats);
        });
      });
    });

    return listToolStats;
  }
}
