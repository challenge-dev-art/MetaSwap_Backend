import { NextFunction, Request, Response } from 'express';
import { CurrencyListing } from '@/interfaces/currencies.interface';
import { currencies } from '@/config/currencies';

export class CurrenciesController {
  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: CurrencyListing = { items: [...currencies] };
    res.json(response);
  };
}
