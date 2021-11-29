import { Column, Entity } from 'typeorm';
import { IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@annio/core/lib/entities';
import { IOrder, ORDER_STATUS } from '@annio/core/lib/business/order.business';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column()
  @Expose()
  @IsEnum(ORDER_STATUS)
  public status: ORDER_STATUS;
}
