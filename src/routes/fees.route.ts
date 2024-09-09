import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { FeesController } from '@/controllers/fees.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AdminValidationMiddleware } from '@/middlewares/admin-validation.middleware';
import { CreateFeeDto } from '@/dtos/fees.dto';

export class FeesRoute implements Routes {
  public path = '/fees';
  public router = Router();
  public news = new FeesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.news.getAllFees(req, res, next).catch(next); 
    });

    this.router.get(`${this.path}/get-fee`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.news.getFee(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(CreateFeeDto), (req: RequestWithUser, res, next) => {
      this.news.createFee(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/update`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(CreateFeeDto), (req: RequestWithUser, res, next) => {
      this.news.updateFee(req, res, next).catch(next);
    });

    this.router.delete(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), (req: RequestWithUser, res, next) => {
      this.news.deleteFee(req, res, next).catch(next);
    });
  }
}