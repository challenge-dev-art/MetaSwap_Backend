import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CalypsoEventsController } from '@/controllers/calypso-events.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CalypsoEventDto } from '@/dtos/calypso-events.dto';

export class CalypsoEventsRoute implements Routes {
  public path = '/calypso-events';
  public router = Router();
  public calypsoEvents = new CalypsoEventsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(CalypsoEventDto), (req, res, next) => {
      this.calypsoEvents.handleEvent(req, res, next).catch(next);
    });
  }
}
