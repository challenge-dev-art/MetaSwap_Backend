import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AutoconvertCurrenciesController } from '@/controllers/autoconvert-currencies.controller';

export class AutoconvertCurrenciesRoute implements Routes {
  public path = '/autoconvert-currencies';
  public router = Router();
  public autoconverCurrencies = new AutoconvertCurrenciesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.autoconverCurrencies.getCurrencies(req, res, next);
    });
  }
}
