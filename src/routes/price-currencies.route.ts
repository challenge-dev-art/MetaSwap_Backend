import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PriceCurrenciesController } from '@/controllers/price-currencies.controller';

export class PriceCurrenciesRoute implements Routes {
  public path = '/price-currencies';
  public router = Router();
  public priceCurrencies = new PriceCurrenciesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.priceCurrencies.getCurrencies(req, res, next);
    });
  }
}
