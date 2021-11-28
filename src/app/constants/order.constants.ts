import { AppConfig } from '@app/config';

export class ORDER_ROUTES {
  static TAGS = 'Order APIs';
  static _PREFIX = 'orders';
  // supporter
  static GeneratePath(path: string) {
    return `${AppConfig.apiConfig.prefix}${ORDER_ROUTES._PREFIX}/${path}`;
  }
  //
  static CREATE = ORDER_ROUTES.GeneratePath('create');
  static CANCEL = ORDER_ROUTES.GeneratePath('cancel');
  static CHECK_STATUS = ORDER_ROUTES.GeneratePath('check-status');
}
