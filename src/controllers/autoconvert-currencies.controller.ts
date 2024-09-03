import { NextFunction, Request, Response } from 'express';
import { CurrencyListing } from '@/interfaces/currencies.interface';
import { autoconvertCurrencies } from '@/config/autoconvert-currencies';

export class AutoconvertCurrenciesController {
  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: CurrencyListing = { items: autoconvertCurrencies };
    res.json(response);
  };
}
