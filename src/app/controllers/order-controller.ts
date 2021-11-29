import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@annio/core/lib/controllers';
import { ORDER_ROUTES } from '@app/constants';
import { OrderService } from '@app/services';
import { CreateOrderDTO, OrderDTO } from '@app/dto';
import { ORDER_STATUS } from '@annio/core/lib/interfaces';

@ApiTags(ORDER_ROUTES.TAGS)
@Controller()
export class OrderController extends BaseController {
  constructor(private readonly adminService: OrderService) {
    super(OrderController.name);
  }

  @MessagePattern('order_create')
  async create(body: CreateOrderDTO): Promise<OrderDTO> {
    const newOrder = await this.adminService.create(body);
    return new OrderDTO(newOrder);
  }

  @MessagePattern('order_cancel')
  async cancel(id: string): Promise<boolean> {
    return await this.adminService.cancel(id);
  }

  @MessagePattern('order_cancel')
  async checkOrderStatus(id: string): Promise<ORDER_STATUS> {
    return await this.adminService.checkStatus(id);
  }
}
