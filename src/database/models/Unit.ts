import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from './Item';
import { Tool } from './Tool';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Item, (item) => item.unit)
  items?: Item[];

  @OneToMany(() => Tool, (tool) => tool.unit)
  tools?: Tool[];
}
