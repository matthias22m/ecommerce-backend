import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number

  @Column()
  sku: string

  @Column()
  quantity : number

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  category: Category
}
