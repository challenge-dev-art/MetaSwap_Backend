// См. https://docs.calypso.finance/reference/enum-description#payout-state
export type PayoutState =
  | 'CREATION_IN_PROGRESS' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'PENDING_CONFIRMATION' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'CONFIRMED' // Создано
  | 'IN_PROGRESS' // В ожидании
  | 'COMPLETED' // Завершено
  | 'FAILED' // Ошибка
  | 'CANCELED'; // Отменено

export interface Payout {
  id: string;
  depositAddress: string; // адрес, на который необходимо перечислить средства отправителю
  amount: number;
  currencyId: string; // см. /payout-currencies/
  comment: string;
  state: PayoutState;
  transactionId: string;
}

export interface PayoutListing {
  items: Payout[];
}

export interface CreatePayoutErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'WRONG_CRYPTO_ADDRESS_ERR' | 'API_ERROR';
  message: string;
}
