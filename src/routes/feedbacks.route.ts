import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { FeedbackController } from '@/controllers/feedbacks.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AdminValidationMiddleware } from '@/middlewares/admin-validation.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateFeedbackDto, DeleteFeedbackDto } from '@/dtos/feedbacks.dto';

export class FeedbacksRoute implements Routes {
  public path = '/feedback';
  public router = Router();
  public feedbacks = new FeedbackController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, AuthMiddleware(), AdminValidationMiddleware(), (req: RequestWithUser, res, next) => {
      this.feedbacks.getAllFeedback(req, res, next).catch(next);
    });

    this.router.get(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), (req: RequestWithUser, res, next) => {
      this.feedbacks.getFeedback(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), ValidationMiddleware(CreateFeedbackDto), (req: RequestWithUser, res, next) => {
      this.feedbacks.postFeedback(req, res, next).catch(next);
    });

    this.router.delete(`${this.path}`, AuthMiddleware(), ValidationMiddleware(DeleteFeedbackDto), (req: RequestWithUser, res, next) => {
      this.feedbacks.deleteFeedback(req, res, next).catch(next);
    });
  }
}