import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepoService } from '@annio/core/services';
import { ORDER_STATUS } from '@annio/core/business/order/order.common';
import { CreateOrderDTO } from '@annio/core/business/order/order.dto';
import { OrderEntity } from '@app/entities/order.entity';
import { plainToClass } from 'class-transformer';
import { PaymentService } from './payment.service';
import { PAYMENT_STATUS } from '@annio/core/business/payment/payment.common';
import { ProcessOrderPaymentDTO } from '@annio/core/business/payment/payment.dto';
import { AppConfig } from '@app/config';

@Injectable()
export class OrderService extends BaseRepoService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
  ) {
    super(repository, OrderService.name);
  }

  public async assertOrder(body: CreateOrderDTO): Promise<void> {
    // TODO: verify product #service
    // TODO: verify inventory #service
    const maxQuantity = 100; // mock: this value from inventory service
    // verify product quantity
    if (body?.quantity <= 0) {
      throw new BadRequestException(
        `Quantity needs to be greater than 0 and lower than ${maxQuantity}`,
      );
    }
  }

  public async getValidById(id: string): Promise<OrderEntity> {
    const orderVerified = await this.findById(id);
    if (!orderVerified) throw new BadRequestException(`your order not found!`);
    return orderVerified;
  }

  async create(body: CreateOrderDTO): Promise<OrderEntity> {
    this.logger.log(`create`);

    await this.assertOrder(body);
    const newOrder = await plainToClass(OrderEntity, {
      ...body,
      status: ORDER_STATUS.CREATED,
    });
    const newUser = this.repository.create(newOrder);
    let orderCreated = await this.repository.save(newUser);
    orderCreated = await this.processPayment(orderCreated);
    // No need to wait for the delivery process
    this.processDelivery(orderCreated, AppConfig.services.delivery.secondDelay);
    return orderCreated;
  }

  public async cancelById(id: string): Promise<boolean> {
    this.logger.log(`cancel order (order: ${id}`);

    const orderVerified = await this.getValidById(id);
    if (orderVerified.status === ORDER_STATUS.CANCELLED) {
      throw new BadRequestException('Your order cannot cancelled');
    }

    await this.changeStatus(id, ORDER_STATUS.CANCELLED);

    return true;
  }

  public async checkStatusById(id: string): Promise<ORDER_STATUS> {
    const orderVerified = await this.getValidById(id);
    return orderVerified.status;
  }

  public async changeStatus(id: string, status: ORDER_STATUS) {
    this.logger.log(`change status (order: ${id}, status: ${status})`);
    return await this.repository.update({ id }, { status });
  }

  public async processPayment(order: OrderEntity): Promise<OrderEntity> {
    if (!order || order.status !== ORDER_STATUS.CREATED) return order;

    this.logger.log(`process payment : ${order.id}`);

    const paymentStatusResponse = await this.paymentService.processOrderPayment(
      plainToClass(ProcessOrderPaymentDTO, { orderId: order.id }),
    );

    this.logger.log(`payment-response : ${paymentStatusResponse}`);

    switch (paymentStatusResponse) {
      case PAYMENT_STATUS.CONFIRMED:
        await this.changeStatus(order.id, ORDER_STATUS.CONFIRMED);
        break;
      case PAYMENT_STATUS.DECLINED:
        await this.changeStatus(order.id, ORDER_STATUS.CANCELLED);
        break;
      default:
        throw new InternalServerErrorException(
          'Cannot verify your order payment',
        );
    }

    return await this.findById(order.id);
  }

  public async processDelivery(
    order: OrderEntity,
    secondDelay: number,
  ): Promise<OrderEntity> {
    return new Promise(async resolve => {
      if (!order || order.status !== ORDER_STATUS.CONFIRMED) return false;

      this.logger.log(`delivery: ${order.id}`);

      setTimeout(async () => {
        // TODO: call to delivery #service
        await this.changeStatus(order.id, ORDER_STATUS.DELIVERED);
        resolve(await this.findById(order.id));
      }, secondDelay * 1000);
    });
  }
}
