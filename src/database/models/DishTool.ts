import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './Dish';
import { Tool } from './Tool';

@Entity()
export class DishTool {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public dishId: number;

  @Column()
  public toolId: number;

  @Column()
  public amount: number;

  @ManyToOne(() => Tool, (tool) => tool.dishTools)
  public tool: Tool;

  @ManyToOne(() => Dish, (dish) => dish.dishRecipes)
  public dish: Dish;
}
