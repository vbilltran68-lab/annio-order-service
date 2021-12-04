import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BaseController } from '@annio/core/controllers';
import { OrderService } from '@app/services';
import {
  ORDER_STATUS,
  ORDER_REQUEST_ACTION,
} from '@annio/core/business/order/order.common';
import { OrderDTO, CreateOrderDTO } from '@annio/core/business/order/order.dto';
import { plainToClass } from 'class-transformer';

@Controller()
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super(OrderController.name);
  }

  @EventPattern(ORDER_REQUEST_ACTION.GET_ALL)
  async getAll(@Ctx() context: RmqContext): Promise<OrderDTO[]> {
    this.logger.log(ORDER_REQUEST_ACTION.GET_ALL, context.getPattern());
    const allOrder = await this.orderService.getAll();
    return allOrder.map(x => plainToClass(OrderDTO, x));
  }

  @EventPattern(ORDER_REQUEST_ACTION.GET_BY_ID)
  async getInfo(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<OrderDTO> {
    this.logger.log(ORDER_REQUEST_ACTION.GET_BY_ID, context.getPattern());
    return plainToClass(OrderDTO, await this.orderService.getValidById(id));
  }

  @EventPattern(ORDER_REQUEST_ACTION.CREATE)
  async create(
    @Payload() body: CreateOrderDTO,
    @Ctx() context: RmqContext,
  ): Promise<OrderDTO> {
    this.logger.log(ORDER_REQUEST_ACTION.CREATE, context.getPattern());
    return plainToClass(OrderDTO, await this.orderService.create(body));
  }

  @EventPattern(ORDER_REQUEST_ACTION.CANCEL_BY_ID)
  async cancel(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    this.logger.log(ORDER_REQUEST_ACTION.CANCEL_BY_ID, context.getPattern());
    return await this.orderService.cancelById(id);
  }

  @EventPattern(ORDER_REQUEST_ACTION.CHECK_STATUS_BY_ID)
  async checkStatus(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<ORDER_STATUS> {
    this.logger.log(
      ORDER_REQUEST_ACTION.CHECK_STATUS_BY_ID,
      context.getPattern(),
    );
    return await this.orderService.checkStatusById(id);
  }
}
