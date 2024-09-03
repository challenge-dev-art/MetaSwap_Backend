import { literal, union } from 'zod';

export const PayoutStateSchema = union([
  literal('CREATION_IN_PROGRESS'),
  literal('PENDING_CONFIRMATION'),
  literal('CONFIRMED'),
  literal('IN_PROGRESS'),
  literal('COMPLETED'),
  literal('FAILED'),
  literal('CANCELED'),
]);
