import { literal, union } from 'zod';

export const ExchangeStateSchema = union([literal('IN_PROGRESS'), literal('COMPLETED'), literal('FAILED')]);
