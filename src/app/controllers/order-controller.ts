import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BaseController } from '@annio/core/controllers';
import { OrderService } from '@app/services';
import {
  ORDER_STATUS,
  ORDER_REQUEST_ACTION,
} from '@annio/core/business/order/order.common';
import { CreateOrderDTO } from '@annio/core/business/order/order.dto';
import { IOrder } from '@annio/core/business/order/order.interface';

@Controller()
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super(OrderController.name);
  }

  @MessagePattern(ORDER_REQUEST_ACTION.GET_ALL)
  async getAll(@Ctx() context: RmqContext): Promise<IOrder[]> {
    this.logger.log(context.getPattern(), context.getChannelRef());
    return await this.orderService.getAll();
  }

  @MessagePattern(ORDER_REQUEST_ACTION.GET_BY_ID)
  async getInfo(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<IOrder> {
    this.logger.log(context.getPattern(), context.getChannelRef());
    return await this.orderService.getValidById(id);
  }

  @MessagePattern(ORDER_REQUEST_ACTION.CREATE)
  async create(
    @Payload() body: CreateOrderDTO,
    @Ctx() context: RmqContext,
  ): Promise<IOrder> {
    this.logger.log(context.getPattern(), context.getChannelRef());
    return await this.orderService.create(body);
  }

  @MessagePattern(ORDER_REQUEST_ACTION.CANCEL_BY_ID)
  async cancel(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    this.logger.log(context.getPattern(), context.getChannelRef());
    return await this.orderService.cancelById(id);
  }

  @MessagePattern(ORDER_REQUEST_ACTION.CHECK_STATUS_BY_ID)
  async checkStatus(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<ORDER_STATUS> {
    this.logger.log(context.getPattern(), context.getChannelRef());
    return await this.orderService.checkStatusById(id);
  }
}
