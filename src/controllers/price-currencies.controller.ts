import { NextFunction, Request, Response } from 'express';
import { priceCurrencies } from '@/config/price-currencies';
import { FiatCurrencyListing } from '@/interfaces/currencies.interface';

export class PriceCurrenciesController {
  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: FiatCurrencyListing = { items: priceCurrencies };
    res.json(response);
  };
}
