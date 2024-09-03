import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CurrenciesController } from '@/controllers/currencies.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class CurrenciesRoute implements Routes {
  public path = '/currencies';
  public router = Router();
  public currencies = new CurrenciesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.currencies.getCurrencies(req, res, next);
    });
  }
}
