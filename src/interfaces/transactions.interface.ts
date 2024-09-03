import { Currency } from './currencies.interface';
import { DepositState } from './deposits.interface';
import { PayoutState } from './payouts.interface';

export interface DepositTransaction {
  id: string;
  type: 'DEPOSIT';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  depositState: DepositState;
  currencyId: string;
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}

export interface PayoutTransaction {
  id: string;
  type: 'PAYOUT';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  payoutState: PayoutState;
  currencyId: string;
  currency: Currency;
  value: number;
  depositAddress: string;
  createdAt: string; // date ISO 8601
}

export interface SwapTransaction {
  id: string;
  type: 'SWAP';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  currencyIdFrom: string;
  currencyIdTo: string;
  valueIn: number;
  valueOut: number;
  fee: number;
  createdAt: string; // date ISO 8601
}

export interface InternalTransferOutputTransaction {
  id: string;
  type: 'INTERNAL_TRANSFER_OUTPUT';
  userFrom: string;
  userTo: string;
  currencyId: string; // deprecated
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}

export interface InternalTransferInputTransaction {
  id: string;
  type: 'INTERNAL_TRANSFER_INPUT';
  userFrom: string;
  userTo: string;
  currencyId: string; // deprecated
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}

export type Transaction =
  | DepositTransaction
  | PayoutTransaction
  | SwapTransaction
  | InternalTransferOutputTransaction
  | InternalTransferInputTransaction;

export interface TransactionListing {
  items: Transaction[];
  nextToken: string | null;
}
