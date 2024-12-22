import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/products.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, )
  order: Order;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column('int')
  quantity : number

  @Column('decimal')
  price: number
}
