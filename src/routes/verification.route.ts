import { Router, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { VerificationController } from '@/controllers/verification.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { UploadsMiddleware } from '@/middlewares/uploads.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { VerificationRequestDto } from '@/dtos/verification.dto';

export class VerificationRoute implements Routes {
  public path = '/verification';
  public router = Router();
  public verification = new VerificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res: Response, next: NextFunction) => {
      this.verification.getVerificatiion(req, res, next).catch(next);
    });

    this.router.post(
      `${this.path}`,
      AuthMiddleware(),
      UploadsMiddleware.fields([
        { name: 'photoDoc', maxCount: 1 },
        { name: 'photoUserWithDoc', maxCount: 1 },
      ]),
      ValidationMiddleware(VerificationRequestDto),
      (req: RequestWithUser, res: Response, next: NextFunction) => {
        this.verification.requestVerification(req, res, next).catch(next);
      },
    );
  }
}
