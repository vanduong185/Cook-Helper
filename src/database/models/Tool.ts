import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Unit } from './Unit';
import { DishTool } from './DishTool';

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  size: string;

  @ManyToOne(() => Unit, (unit) => unit.tools)
  unit: Unit;

  @OneToMany(() => DishTool, (dishTool) => dishTool.tool)
  public dishTools!: DishTool[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
