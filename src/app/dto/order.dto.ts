import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { OrderEntity } from '@app/entities';
import { BaseDTO } from '@annio/core/lib/dto';
import { IOrder, ORDER_STATUS } from '@annio/core/lib/interfaces';

export class OrderDTO extends BaseDTO implements IOrder {
  @ApiProperty()
  @MaxLength(10)
  @Expose()
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  constructor(entity: OrderEntity) {
    super(entity);
    this.status = entity.status;
  }
}

export class CreateOrderDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  productId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  quantity: number;
}
