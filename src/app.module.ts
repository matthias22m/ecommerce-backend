import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { json } from 'body-parser';
import { InvoicesModule } from './invoices/invoices.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
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
    PaymentModule,
    InvoicesModule,
  ],
  providers: [PaymentService],
  exports: [UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json({ verify: (req: any, res, buf) => { req.rawBody = buf } })).forRoutes('payments/webhook');
  }
}