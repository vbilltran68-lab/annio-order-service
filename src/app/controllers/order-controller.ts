import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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

  @HttpCode(HttpStatus.OK)
  @Post(ORDER_ROUTES.CREATE)
  async create(@Body() body: CreateOrderDTO): Promise<ResponseDto<any>> {
    return this.ApiResponse(HttpStatus.OK, 'Create Order Success', async () => {
      const newOrder = await this.adminService.create(body);
      return new OrderDTO(newOrder);
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post(ORDER_ROUTES.CANCEL)
  async cancel(@Param('id') id: string): Promise<ResponseDto<any>> {
    return this.ApiResponse(
      HttpStatus.OK,
      'Cancel Order Success',
      async () => await this.adminService.cancel(id),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post(ORDER_ROUTES.CHECK_STATUS)
  async checkOrderStatus(@Param('id') id: string): Promise<ResponseDto<any>> {
    return this.ApiResponse(
      HttpStatus.OK,
      'Cancel Order Success',
      async () => await this.adminService.checkStatus(id),
    );
  }
}
