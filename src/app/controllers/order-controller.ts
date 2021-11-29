import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  TcpContext,
} from '@nestjs/microservices';
import { BaseController } from '@annio/core/lib/controllers';
import { OrderService } from '@app/services';
import {
  ORDER_STATUS,
  OrderDTO,
  CreateOrderDTO,
} from '@annio/core/lib/business/order.business';
import { plainToClass } from 'class-transformer';

@Controller()
export class OrderController extends BaseController {
  constructor(private readonly adminService: OrderService) {
    super(OrderController.name);
  }

  @MessagePattern('order_create')
  async create(
    @Payload() body: CreateOrderDTO,
    @Ctx() context: TcpContext,
  ): Promise<OrderDTO> {
    this.logger.log('ms:create', context.getPattern());
    const newOrder = await this.adminService.create(body);
    return plainToClass(OrderDTO, newOrder);
  }

  @MessagePattern('order_cancel')
  async cancel(
    @Payload() id: string,
    @Ctx() context: TcpContext,
  ): Promise<boolean> {
    this.logger.log('ms:cancel', context.getPattern());
    return await this.adminService.cancel(id);
  }

  @MessagePattern('order_check_status')
  async checkOrderStatus(
    @Payload() id: string,
    @Ctx() context: TcpContext,
  ): Promise<ORDER_STATUS> {
    this.logger.log('ms:checkStatus:', context.getPattern());
    return await this.adminService.checkStatus(id);
  }
}
