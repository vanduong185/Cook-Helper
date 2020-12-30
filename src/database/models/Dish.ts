import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CookType } from './CookType';
import { DishRecipe } from './DishRecipe';
import { DishTool } from './DishTool';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cost: number;

  @Column()
  mainIngredient: string;

  @ManyToOne(() => CookType, (cookType) => cookType.dishes)
  cookType: CookType;

  @OneToMany(() => DishRecipe, (dishRecipe) => dishRecipe.dish)
  public dishRecipes: DishRecipe[];

  @OneToMany(() => DishTool, (dishTool) => dishTool.dish)
  public dishTools: DishTool[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
