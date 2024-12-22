import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

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

export async function validateCreateOrderDto(data: any): Promise<ValidationError[]> {
  const createOrderDto = plainToClass(CreateOrderDto, data);
  const errors = await validate(createOrderDto);
  return errors;
}
