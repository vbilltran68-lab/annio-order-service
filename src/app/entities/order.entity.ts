import { Column, Entity } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@annio/core/entities';
import { ORDER_STATUS } from '@annio/core/business/order/order.common';
import { IOrder } from '@annio/core/business/order/order.interface';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column()
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  public productId!: string;

  @Column()
  @IsNumber()
  @Min(1)
  @Expose()
  public quantity!: number;

  @Column()
  @Expose()
  @IsEnum(ORDER_STATUS)
  public status: ORDER_STATUS;
}
