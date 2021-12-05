import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@annio/core/services';
import {
  PAYMENT_REQUEST_ACTION,
  PAYMENT_STATUS,
} from '@annio/core/business/payment/payment.common';
import { ProcessOrderPaymentDTO } from '@annio/core/business/payment/payment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AppConfig } from '@app/config';
import { ObservableUtils } from '@annio/core/utils';

@Injectable()
export class PaymentService extends BaseService {
  constructor(
    @Inject(AppConfig.services.payment.key)
    private readonly client: ClientProxy,
  ) {
    super(PaymentService.name);
  }

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  public async processOrderPayment(
    payload: ProcessOrderPaymentDTO,
  ): Promise<PAYMENT_STATUS> {
    return await ObservableUtils.getFirstResponse(
      this.client.send(PAYMENT_REQUEST_ACTION.VERIFY, payload),
    );
  }
}
