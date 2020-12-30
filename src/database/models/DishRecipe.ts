import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './Item';
import { Dish } from './Dish';

@Entity()
export class DishRecipe {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public dishId: number;

  @Column()
  public itemId: number;

  @Column()
  public amount: number;

  @ManyToOne(() => Item, (item) => item.dishRecipes)
  public item: Item;

  @ManyToOne(() => Dish, (dish) => dish.dishRecipes)
  public dish: Dish;
}
