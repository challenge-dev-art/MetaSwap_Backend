import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AutoconvertsController } from '@/controllers/autoconverts.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateAutoconvertRequestDto, ExecuteAutoconvertRequestDto } from '@/dtos/autoconverts.dto';

export class AutoconvertsRoute implements Routes {
  public path = '/autoconverts';
  public router = Router();
  public autoconverts = new AutoconvertsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.autoconverts.getAutoconverts(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreateAutoconvertRequestDto), (req: RequestWithUser, res, next) => {
      this.autoconverts.createAutoconvert(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/execute`, AuthMiddleware(), ValidationMiddleware(ExecuteAutoconvertRequestDto), (req: RequestWithUser, res, next) => {
      this.autoconverts.executeAutoconvert(req, res, next).catch(next);
    });
  }
}
