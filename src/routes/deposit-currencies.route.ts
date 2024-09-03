import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DepositCurrenciesController } from '@/controllers/deposit-currencies.controller';

export class DepositCurrenciesRoute implements Routes {
  public path = '/deposit-currencies';
  public router = Router();
  public currencies = new DepositCurrenciesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.currencies.getCurrencies(req, res, next);
    });
  }
}
