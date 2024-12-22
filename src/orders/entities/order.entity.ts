import { Product } from 'src/products/entities/products.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, {onDelete:'SET NULL'})
  user: User;

  @Column({
    type: 'text',
    default: 'placed',
  })
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

  @Column('decimal')
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { onDelete: 'CASCADE' })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}
