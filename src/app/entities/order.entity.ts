import { Column, Entity } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@annio/core/lib/entities';
import { IOrder, ORDER_STATUS } from '@annio/core/lib/business/order.business';

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
