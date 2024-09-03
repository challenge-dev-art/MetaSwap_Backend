import { array, boolean, literal, number, object, optional, string, union } from 'zod';
import { CryptoCurrencySchema } from './crypto-currency-schema';
import { PayoutStateSchema } from './payout-state-schema';

export const PayoutSchema = object({
  id: string(),
  account: string(),
  depositAddress: string(),
  amount: number(),
  currency: CryptoCurrencySchema,
  calypsoFee: number(),
  calypsoFeePercentage: number(),
  state: PayoutStateSchema,
  createdDate: string(),
  transactionHash: optional(string()),
  comment: optional(string()),
  executionDate: optional(string()),
  idempotencyKey: optional(string()),
  errors: optional(
    object({
      withdrawalErrors: array(
        object({
          withdrawalId: string(),
          errors: array(
            object({
              id: number(),
              status: union([
                literal('SUCCESS'),
                literal('NOT_ENOUGH_FUNDS'),
                literal('NOT_ENOUGH_FUNDS_FOR_COMMISSION'),
                literal('NOT_ENOUGH_FUNDS_FOR_SERVICE_COMMISSION'),
              ]),
              errorResolved: boolean(),
              errorMessage: optional(string()),
            }),
          ),
        }),
      ),
    }),
  ),
  cancellation: optional(
    object({
      canceledByUserId: string(),
      canceledByFirstname: string(),
      canceledByLastname: string(),
      cancelMessage: string(),
    }),
  ),
  isInternal: optional(boolean()),
});
