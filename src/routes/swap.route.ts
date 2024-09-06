import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SwapsController } from '@/controllers/swaps.controller';

export class SwapsRoute implements Routes {
  //public path = '/swaps';
  public router = Router();
  public SwapsController = new SwapsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/swaps`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.getSwaps(req, res, next);
    });

    this.router.post(`/swaps`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.createSwaps(req, res, next);
    });

    this.router.get(`/swap-currencies`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.getCurrencyPairs(req, res, next);
    });

    this.router.post(`/swap-rates`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.getRates(req, res, next);
    });

    this.router.post('/swap-display', AuthMiddleware(), (req, res, next) => {
      this.SwapsController.preCalculate(req, res, next);
    });

    this.router.post('/swap-update', AuthMiddleware(), (req, res, next) => {
      this.SwapsController.swapUpdate(req, res, next);
    });
  }
}
