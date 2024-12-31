import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module'; // Import UsersModule

@Module({
  imports: [
    UsersModule,
    OrdersModule, // Add OrdersModule to imports
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
