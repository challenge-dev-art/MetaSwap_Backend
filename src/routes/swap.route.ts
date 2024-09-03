import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { SwapsController } from '@/controllers/swaps.controller';

export class SwapsRoute implements Routes {
  public path = '/swaps';
  public router = Router();
  public SwapsController = new SwapsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.getSwaps(req, res, next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.SwapsController.createSwaps(req, res, next);
    });
  }
}
