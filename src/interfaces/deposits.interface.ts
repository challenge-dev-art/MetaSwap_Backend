export type DepositState =
  | 'PENDING_PAYMENT'
  | 'MEM_POOL_FOUND'
  | 'PAID'
  | 'PENDING_INTERVENTION'
  | 'COMPLETED'
  | 'CANCEL'
  | 'ARCHIVED'
  | 'DECLINED'
  | 'PENDING_COMPLIANCE_CHECK'
  | 'EXPIRED';

export interface Deposit {
  id: string;
  address: string; // адрес, на который необходимо перечислить средства отправителю
  addressQrUrl: string;
  currencyId: string; // см. /currency/
  state: DepositState;
  transactionId: string;
}

export interface DepositListing {
  items: Deposit[];
}

export interface CreateDepositRequest {
  currencyId: string;
}

export interface CreateDepositErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
