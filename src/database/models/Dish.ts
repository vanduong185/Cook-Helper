import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CookType } from './CookType';

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
