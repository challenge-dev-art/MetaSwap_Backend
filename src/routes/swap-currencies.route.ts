import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SwapsController } from '@/controllers/swaps.controller';

export class SwapCurrenciesRoute implements Routes {
  public path = '/swap-currencies';
  public router = Router();
  public swapsController = new SwapsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.swapsController.getCurrencyPairs(req, res, next);
    });
    // this.router.get(`${this.path}`, (req, res, next) => {
    //   console.log('Route-getCurrencyPairs');
    //   this.swapsController.getCurrencyPairs(req, res, next);
    // });
  }
}
