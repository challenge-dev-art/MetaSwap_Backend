import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { OtpController } from '@/controllers/otp.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { DisableOtpRequestDto, EnableOtpRequestDto, OtpAuthRequestDto } from '@/dtos/otp.dto';

export class OtpRoute implements Routes {
  public path = '/otp';
  public router = Router();
  public otp = new OtpController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.otp.getOtp(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/create-secret`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.otp.createSecret(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/enable`, AuthMiddleware(), ValidationMiddleware(EnableOtpRequestDto), (req: RequestWithUser, res, next) => {
      this.otp.enable(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/disable`, AuthMiddleware(), ValidationMiddleware(DisableOtpRequestDto), (req: RequestWithUser, res, next) => {
      this.otp.disable(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/auth`, AuthMiddleware(), ValidationMiddleware(OtpAuthRequestDto), (req: RequestWithUser, res, next) => {
      this.otp.auth(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/logout`, AuthMiddleware(), ValidationMiddleware(OtpAuthRequestDto), (req: RequestWithUser, res, next) => {
      this.otp.logout(req, res, next).catch(next);
    });
  }
}
