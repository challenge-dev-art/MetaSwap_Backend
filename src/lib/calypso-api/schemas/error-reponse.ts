import * as z from 'zod';

export const ErrorSchema = z.object({
  traceId: z.string(),
  errorCode: z.string(),
  message: z.string(),
});
