import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  findAllOrders() {
    return this.orderService.findAllOrders();
  }

  @Get(':id')
  findOneOrderById(@Param('id') id:number){
    return this.orderService.findOneById(id)
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: number) {
    return this.orderService.removeOrder(id);
  }
}
