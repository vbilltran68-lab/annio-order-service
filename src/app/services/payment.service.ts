import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@annio/core/lib/services';
import {
  PAYMENT_REQUEST_ACTION,
  PAYMENT_STATUS,
  ProcessOrderPaymentDTO,
} from '@annio/core/lib/business/payment.business';
import { ClientProxy } from '@nestjs/microservices';
import { AppConfig } from '@app/config';
import { ObservableUtils } from '@annio/core/lib/utils';

@Injectable()
export class PaymentService extends BaseService {
  constructor(
    @Inject(AppConfig.services.payment.key)
    private readonly paymentClient: ClientProxy,
  ) {
    super(PaymentService.name);
  }

  public async processOrderPayment(
    payload: ProcessOrderPaymentDTO,
  ): Promise<PAYMENT_STATUS> {
    return await ObservableUtils.getFirstResponse(
      this.paymentClient.send(PAYMENT_REQUEST_ACTION.VERIFY, payload),
    );
  }
}
