import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto, validateCreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    validateCreateOrderDto(createOrderDto)
    const { userId, items } = createOrderDto;

    const user = await this.usersService.findOneById(userId);
  
    if (!user) {
      throw new NotFoundException('User Not Found.');
    }

    const orderItems: OrderItem[] = [];

    let total = 0;
    for (const item of items) {
      const product = await this.productsService.findProductById(
        item.productId,
      );
      
      if (!product) {
        throw new NotFoundException(
          `Product with ID '${item.productId}' Not Found.`,
        );
      }
      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });

      orderItems.push(orderItem);
      total += orderItem.price;
    }

    const { password, ...userInfo } = user;

    const order = this.ordersRepository.create({
      user: userInfo,
      total,
      items: orderItems,
    });

    return this.ordersRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items', 'user', 'items.product'],
    });
  }

  async findOneById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order Not Found.');
    }

    return order;
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    
    const order = await this.findOneById(id);

    if (!order) {
      throw new NotFoundException('Order Not Found.');
    }
    order.status = updateOrderStatusDto.status;

    return order;
  }

  async removeOrder(id: number) {
    const order = await this.findOneById(id);

    if (!order) {
      throw new NotFoundException('Order Not Found.');
    }
    return this.ordersRepository.remove(order)
  }
}
