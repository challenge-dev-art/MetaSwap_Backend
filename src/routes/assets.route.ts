import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AssetsController } from '@/controllers/assets.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class AssetsRoute implements Routes {
  public path = '/assets';
  public router = Router();
  public assets = new AssetsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.assets.getAssets(req, res, next).catch(next);
    });
  }
}
