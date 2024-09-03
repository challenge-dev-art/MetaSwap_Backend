import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PayoutsController } from '@/controllers/payouts.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreatePayoutDto } from '@/dtos/payouts.dto';

export class PayoutsRoute implements Routes {
  public path = '/payouts';
  public router = Router();
  public payouts = new PayoutsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.payouts.getPayouts(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreatePayoutDto), (req: RequestWithUser, res, next) => {
      this.payouts.createPayout(req, res, next).catch(next);
    });
  }
}
