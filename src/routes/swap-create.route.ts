import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SwapsController } from '@/controllers/swaps.controller';

export class SwapCreatesRoute implements Routes {
  public path = '/swap-creates';
  public router = Router();
  public SwapsController = new SwapsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      // console.log('req.body: ', req.body);
      // console.log('req.user: ', req.user);
      this.SwapsController.createSwaps(req, res, next);
    });
  }
}
