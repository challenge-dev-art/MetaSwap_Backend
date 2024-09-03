import { NextFunction, Request, Response } from 'express';
import { CurrencyListing } from '@/interfaces/currencies.interface';
import { swapCurrencies } from '@/config/swap-currencies';

export class SwapCurrenciesController {
  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: CurrencyListing = { items: swapCurrencies };
    res.json(response);
  };
}
