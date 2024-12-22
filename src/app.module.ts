import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { Product } from './products/entities/products.entity';
import { Category } from './products/entities/category.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User,Product,Category,Order,OrderItem],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  exports: [UsersModule],
})
export class AppModule {}
