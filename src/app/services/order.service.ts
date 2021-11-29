import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { BaseService } from '@annio/core/lib/services';
import {
  ORDER_STATUS,
  CreateOrderDTO,
} from '@annio/core/lib/business/order.business';
import { OrderEntity } from '@app/entities/order.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {
    super(repository, OrderService.name);
  }

  public async assertOrder(body: CreateOrderDTO): Promise<void> {
    // verify anything about order { conflict, invalid }
    if (body?.quantity <= 0) {
      throw new BadRequestException('quantity needs to be greater than 0');
    }
  }

  async create(body: CreateOrderDTO): Promise<OrderEntity> {
    await this.assertOrder(body);
    const newOrder = await plainToClass(OrderEntity, {
      ...body,
    });
    const newUser = this.repository.create(newOrder);
    await this.repository.save(newUser);
    return await this.findById(newUser.id);
  }

  public async cancel(id: string): Promise<boolean> {
    const orderVerified = await this.findById(id);
    if (!orderVerified) throw new BadRequestException(`your order not found!`);
    await this.repository.update({ id }, { status: ORDER_STATUS.CANCELLED });
    return true;
  }

  public async checkStatus(id: string): Promise<ORDER_STATUS> {
    const orderVerified = await this.findById(id);
    if (!orderVerified) throw new BadRequestException(`your order not found!`);
    return orderVerified.status;
  }
}
