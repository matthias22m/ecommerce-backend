import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  items: OrderItemDto[];
}
