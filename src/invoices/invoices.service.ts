import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import easyinvoice from 'easyinvoice';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const invoiceData = {
      sender: {
        company: 'Your Company Name',
        address: 'Your Address',
        zip: '12345',
        city: 'Your City',
        country: 'Your Country',
      },
      client: {
        company: order.user.email,
        address: 'Client Address',
        zip: 'Client Zip',
        city: 'Client City',
        country: 'Client Country',
      },
      information: {
        number: order.id.toString(),
        date: new Date(order.createdAt).toISOString().split('T')[0],
      },
      products: order.items.map((item) => ({
        quantity: item.quantity.toString(),
        description: item.product.name,
        price: item.price,
      })),
      bottomNotice: 'Thank you for your purchase!',
    };

    const invoicePath = `invoices/invoice_${order.id}.pdf`;

    // Ensure the invoices directory exists
    if (!fs.existsSync('invoices')) {
      fs.mkdirSync('invoices');
    }

    // Generate the invoice
    const result = await easyinvoice.createInvoice(invoiceData);

    // Save the PDF to a file
    fs.writeFileSync(invoicePath, result.pdf, 'base64');

    return invoicePath;
  }
}
