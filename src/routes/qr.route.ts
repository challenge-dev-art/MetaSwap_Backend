import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { QrController } from '@/controllers/qr.controller';

export class QrRoute implements Routes {
  public path = '/qr';
  public router = Router();
  public qr = new QrController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req: RequestWithUser, res, next) => {
      this.qr.generateQr(req, res, next).catch(next);
    });
  }
}
