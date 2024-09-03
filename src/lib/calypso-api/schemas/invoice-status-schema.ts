import { literal, union } from 'zod';

export const InvoiceStateSchema = union([
  literal('MEM_POOL_FOUND'),
  literal('PENDING_PAYMENT'),
  literal('PAID'),
  literal('COMPLETED'),
  literal('PENDING_INTERVENTION'),
  literal('CANCEL'),
  literal('ARCHIVED'),
  literal('DECLINED'),
  literal('PENDING_COMPLIANCE_CHECK'),
]);
