import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

export class StatusRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}status`, (_req, res, _next) => {
      res.json({ message: 'OK' });
    });
  }
}
