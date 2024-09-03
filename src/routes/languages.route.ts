import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { LanguagesController } from '@/controllers/languages.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class LanguagesRoute implements Routes {
  public path = '/languages';
  public router = Router();
  public languaes = new LanguagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(), (req, res, next) => {
      this.languaes.getLanguages(req, res, next);
    });
  }
}
