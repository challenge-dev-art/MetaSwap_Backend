import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TransactionsController } from '@/controllers/transactions.controller';

export class TransactionsRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactions = new TransactionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.transactions.getTransactions(req, res, next).catch(next);
    });
  }
}
