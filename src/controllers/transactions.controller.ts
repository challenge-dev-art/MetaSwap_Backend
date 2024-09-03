import { NextFunction, Response } from 'express';
import Container from 'typedi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TransactionCategory, TransactionFilter, TransactionsService } from '@/services/transactions.service';
import * as z from 'zod';

const transactionCategories = new Set<TransactionCategory>(['TRANSFER', 'EXCHANGE', 'OFFCHAIN', 'INCOMING', 'OUTCOMING']);

const GetTrnsactionQuerySchema = z.object({
  type: z.optional(
    z.union([
      z.literal('REFILL'),
      z.literal('SWAP'),
      z.literal('WITHDRAW'),
      z.literal('INTERNAL_TRANSFER_OUTPUT'),
      z.literal('INTERNAL_TRANSFER_INPUT'),
    ]),
  ),
  'crypto-token': z.optional(z.string()),
  'crypto-chain': z.optional(z.string()),
  category: z.optional(
    z.string().transform((arg, ctx) => {
      const chunks = arg.split(',');
      const wrongIndex = chunks.findIndex(chunk => !transactionCategories.has(chunk as TransactionCategory));
      if (wrongIndex !== -1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `unexpected category: ${JSON.stringify(chunks[wrongIndex])}`,
        });
        return z.NEVER;
      } else {
        return chunks as TransactionCategory[];
      }
    }),
  ),
});

export class TransactionsController {
  public transactions = Container.get(TransactionsService);

  public async getTransactions(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    const queryParsingResult = GetTrnsactionQuerySchema.safeParse(req.query);

    let filterRaw: z.infer<typeof GetTrnsactionQuerySchema> | null = null;
    if (queryParsingResult.success) {
      filterRaw = queryParsingResult.data;
    } else {
      const error = queryParsingResult.error;
      res.status(400).json({ message: error ? error.message : 'failed to parse query' });
      return;
    }

    let filter: TransactionFilter | undefined = undefined;
    if (filterRaw) {
      filter = {
        type: filterRaw.type,
        cryptoToken: filterRaw['crypto-token'],
        cryptoChain: filterRaw['crypto-chain'],
        category: filterRaw.category,
      };
    }

    const transactionListing = await this.transactions.getTransactionListingView(req.user.id, filter);

    res.json(transactionListing);
  }
}
