import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Unit } from './Unit';
import { DishRecipe } from './DishRecipe';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  provider: string;

  @ManyToOne(() => Unit, (unit) => unit.items)
  unit: Unit;

  @OneToMany(() => DishRecipe, (dishRecipe) => dishRecipe.item)
  public dishRecipes!: DishRecipe[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
