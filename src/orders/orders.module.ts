import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderItem } from './entities/orderItem.entity';
import { ProductsService } from 'src/products/products.service';
import { PaymentService } from 'src/payment/payment.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { InvoicesController } from 'src/invoices/invoices.controller';
import { PaymentController } from 'src/payment/payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrdersController,PaymentController,InvoicesController],
  providers: [OrdersService,PaymentService,InvoicesService],
  exports: [OrdersService, TypeOrmModule], 
})
export class OrdersModule {}
