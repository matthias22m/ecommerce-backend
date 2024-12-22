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

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'text',
    default: 'placed',
  })
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

  @Column('decimal')
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}

// @Entity()
// export class OrderItem {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Order, (order) => order.items)
//   order: Order;

//   @ManyToOne(() => Product, (product) => product.id)
//   product: Product;

//   @Column('int')
//   quantity : number

//   @Column('decimal')
//   price: number
// }
