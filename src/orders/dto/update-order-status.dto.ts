import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class UpdateOrderStatusDto{
    @IsNotEmpty()
    @IsString()
    @IsIn(['placed', 'shipped', 'delivered', 'cancelled', 'returned'])
    status: 'placed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
}