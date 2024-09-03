import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { AuthController } from '@/controllers/auth.controller';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/login`, (req: RequestWithUser, res, next) => {
      this.auth.logIn(req, res, next).catch(next);
    });

    this.router.post(`/signup`, (req: RequestWithUser, res, next) => {
      this.auth.signUp(req, res, next).catch(next);
    });

    this.router.post(`/logout`, (req: RequestWithUser, res, next) => {
      this.auth.logOut(req, res, next).catch(next);
    });
  }
}
