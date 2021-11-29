import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@annio/core/lib/controllers';
import { ResponseDto } from '@annio/core/lib/dto';
import { ORDER_ROUTES } from '@app/constants';
import { OrderService } from '@app/services';
import { CreateOrderDTO, OrderDTO } from '@app/dto';

@ApiTags(ORDER_ROUTES.TAGS)
@Controller()
export class OrderController extends BaseController {
  constructor(private readonly adminService: OrderService) {
    super(OrderController.name);
  }

  @MessagePattern('order_create')
  async create(body: CreateOrderDTO): Promise<ResponseDto<any>> {
    return this.ApiResponse(HttpStatus.OK, 'Create Order Success', async () => {
      const newOrder = await this.adminService.create(body);
      return new OrderDTO(newOrder);
    });
  }

  @MessagePattern('order_cancel')
  async cancel(id: string): Promise<ResponseDto<any>> {
    return this.ApiResponse(
      HttpStatus.OK,
      'Cancel Order Success',
      async () => await this.adminService.cancel(id),
    );
  }

  @MessagePattern('order_cancel')
  async checkOrderStatus(id: string): Promise<ResponseDto<any>> {
    return this.ApiResponse(
      HttpStatus.OK,
      'Cancel Order Success',
      async () => await this.adminService.checkStatus(id),
    );
  }
}
