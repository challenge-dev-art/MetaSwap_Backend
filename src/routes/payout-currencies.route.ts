import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PayoutCurrenciesController } from '@/controllers/payout-currencies.controller';

export class PayoutCurrenciesRoute implements Routes {
  public path = '/payout-currencies';
  public router = Router();
  public payoutCurrencies = new PayoutCurrenciesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.payoutCurrencies.getCurrencies(req, res, next);
    });
  }
}
