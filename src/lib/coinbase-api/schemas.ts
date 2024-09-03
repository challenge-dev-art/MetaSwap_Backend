import { union, literal, object, string } from 'zod';

export const TokenPriceResponseSchema = object({
  data: object({
    amount: string(),
    base: string(),
    currency: string(),
  }),
});
