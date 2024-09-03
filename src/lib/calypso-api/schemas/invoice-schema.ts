import { boolean, literal, number, object, optional, string, union } from 'zod';
import { CryptoCurrencySchema } from './crypto-currency-schema';
import { InvoiceStateSchema } from './invoice-status-schema';
import { InterventionTypeSchema } from './intervention-type-schema';

export const InvoiceSchema = object({
  id: string(),
  invoiceAddress: string(),
  type: union([literal('SINGLE'), literal('BOUND')]),
  amount: optional(number()),
  fee: optional(number()),
  totalDebitAmount: number(),
  currency: CryptoCurrencySchema,
  state: InvoiceStateSchema,
  idempotencyKey: string(),
  interventionType: optional(InterventionTypeSchema),
  isInterventionResolved: boolean(),
});
