import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { DepositCurrenciesService } from '@/services/deposit-currencies.service';
import { DepositCurrencyListing } from '@/interfaces/deposit-currencies.interface';

export class DepositCurrenciesController {
  public depositCurrencies = Container.get(DepositCurrenciesService);

  public getCurrencies = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: DepositCurrencyListing = await this.depositCurrencies.getDepositCurrencies();
    res.json(response);
  };
}
