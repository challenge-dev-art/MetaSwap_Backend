import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateInternalTransferDto } from '@/dtos/internalTransfer.dto';
import { InternalTransfersController } from '@/controllers/internalTransfers.controller';

export class InternalTransfersRoute implements Routes {
  public path = '/internal-transfers';
  public router = Router();
  public internalTransfers = new InternalTransfersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreateInternalTransferDto), (req: RequestWithUser, res, next) => {
      this.internalTransfers.createInternalTransfer(req, res, next).catch(next);
    });
  }
}
