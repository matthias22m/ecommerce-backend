import { Injectable, NotFoundException, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Order } from 'src/orders/entities/order.entity';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  public stripe: Stripe;
  private stripeApiKey: string;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private usersServices: UsersService,
    private configService: ConfigService,
  ) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_API_KEY');
    if (!this.stripeApiKey) {
      throw new InternalServerErrorException('STRIPE_API_KEY environment variable is not set');
    }
    this.stripe = new Stripe(this.stripeApiKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'user', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order Not Found.');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebHook(event: Stripe.Event): Promise<void> {
    if (event.type == 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = parseInt(paymentIntent.metadata.orderId);

      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (order) {
        order.status = 'delivered';
        await this.orderRepository.save(order);
      }
    }
  }
}
