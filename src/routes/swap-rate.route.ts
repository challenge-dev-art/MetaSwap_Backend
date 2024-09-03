import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SwapRatesController } from '@/controllers/swap-rates.controller';

export class SwapRatesRoute implements Routes {
  public path = '/swap-rates';
  public router = Router();
  public SwapRates = new SwapRatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.SwapRates.getRates(req, res, next);
    });
  }
}
