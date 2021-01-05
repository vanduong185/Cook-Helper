import { CookTypeDTO } from './CookTypeDTO';
import { DishRecipeDTO } from './DishRecipeDTO';
import { DishToolDTO } from './DishToolDTO';

export class DishDTO {
  id: number;
  name: string;
  cost: number;
  mainIngredient: string;
  cookType: CookTypeDTO;
  dishRecipes: DishRecipeDTO[];
  dishTools: DishToolDTO[];
}
