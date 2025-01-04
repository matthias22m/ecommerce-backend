import { Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import * as rawBody from 'raw-body';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: number) {
    console.log(orderId);
    return this.paymentService.createPaymentIntent(orderId);
  }

  @Post('webhook')
  async handleWebHook(@Req() request: Request) {
    const rawBodyBuffer = request.body; // Use the raw body directly

    const sign = request.headers['stripe-signature'];
    const stripeEvent = this.paymentService.stripe.webhooks.constructEvent(
      rawBodyBuffer,
      sign,
      process.env.STRIPE_API_KEY,
    );

    this.paymentService.handleWebHook(stripeEvent);
  }
}
