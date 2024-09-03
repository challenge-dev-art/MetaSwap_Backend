export interface CreateInternalTransferSuccessResponse {
  kind: 'OK';
  transactionId: string; // см. /transactions
}

export interface CreateInternalTransferErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
