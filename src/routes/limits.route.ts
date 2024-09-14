import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { LimitsController } from '@/controllers/limits.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateLimitDto, UpdateLimitDto } from '@dtos/limits.dto';

export class LimitsRoute implements Routes {
  public path = '/limits';
  public router = Router();
  public limits = new LimitsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.limits.getLimits(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreateLimitDto), (req: RequestWithUser, res, next) => {
      this.limits.createLimit(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/update`, AuthMiddleware(), ValidationMiddleware(UpdateLimitDto), (req: RequestWithUser, res, next) => {
      this.limits.updateLimit(req, res, next).catch(next);
    });
  }
}