import { Router, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { AccountController } from '@/controllers/account.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
  ConfirmEmailUpdateRequestDto,
  RequestEmailUpdateRequestDto,
  UpdateAccountCurrencyDto,
  UpdateAccountEmailDto,
  UpdateAccountLanguageDto,
} from '@/dtos/account.dto';

export class AccountRoute implements Routes {
  public path = '/account';
  public router = Router();
  public user = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.user.getUser(req, res, next).catch(next);
    });

    this.router.post(
      `${this.path}/update-currency`,
      AuthMiddleware(),
      ValidationMiddleware(UpdateAccountCurrencyDto),
      (req: RequestWithUser, res, next) => {
        this.user.updatePriceCurrency(req, res, next);
      },
    );

    this.router.post(
      `${this.path}/update-language`,
      AuthMiddleware(),
      ValidationMiddleware(UpdateAccountLanguageDto),
      (req: RequestWithUser, res, next) => {
        this.user.updateLanguage(req, res, next).catch(next);
      },
    );

    this.router.post(
      `${this.path}/update-email`,
      AuthMiddleware(),
      ValidationMiddleware(UpdateAccountEmailDto),
      (req: RequestWithUser, res, next) => {
        this.user.updateEmail(req, res, next).catch(next);
      },
    );

    this.router.post(
      `${this.path}/request-email-update`,
      AuthMiddleware(),
      ValidationMiddleware(RequestEmailUpdateRequestDto),
      (req: RequestWithUser, res: Response, next: NextFunction) => {
        this.user.requestEmailUpdate(req, res, next).catch(next);
      },
    );

    this.router.post(
      `${this.path}/confirm-email-update`,
      AuthMiddleware(),
      ValidationMiddleware(ConfirmEmailUpdateRequestDto),
      (req: RequestWithUser, res: Response, next: NextFunction) => {
        this.user.confirmEmailUpdate(req, res, next).catch(next);
      },
    );
  }
}
