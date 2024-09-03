import { NextFunction, Request, Response } from 'express';
import { CurrencyListing } from '@/interfaces/currencies.interface';
import { payoutCurrencies } from '@/config/payout-currencies';

export class PayoutCurrenciesController {
  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: CurrencyListing = { items: payoutCurrencies };
    res.json(response);
  };
}
