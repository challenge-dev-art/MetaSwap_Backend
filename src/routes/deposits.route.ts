import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { DepositsController } from '@/controllers/deposits.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateDepositDto } from '@/dtos/deposits.dto';

export class DepositsRoute implements Routes {
  public path = '/deposits';
  public router = Router();
  public deposits = new DepositsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.deposits.getDeposits(req, res, next).catch(next);
    });

    this.router.get(`${this.path}/:id`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.deposits.getDeposit(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreateDepositDto), (req: RequestWithUser, res, next) => {
      this.deposits.createDeposit(req, res, next).catch(next);
    });
  }
}
