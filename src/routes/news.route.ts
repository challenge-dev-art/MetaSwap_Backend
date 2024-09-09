import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { NewsController } from '@/controllers/news.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AdminValidationMiddleware } from '@/middlewares/admin-validation.middleware';
import { CreateNewsDto, UpdateNewsDto, DeleteNewsDto } from '@/dtos/news.dto';

export class NewsRoute implements Routes {
  public path = '/news';
  public router = Router();
  public news = new NewsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.news.getAllNews(req, res, next).catch(next); 
    });

    this.router.get(`${this.path}/get-news`, AuthMiddleware(), (req: RequestWithUser, res, next) => {
      this.news.getNewsById(req, res, next).catch(next);
    });

    this.router.post(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(CreateNewsDto), (req: RequestWithUser, res, next) => {
      this.news.createNews(req, res, next).catch(next);
    });

    this.router.post(`${this.path}/update`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(UpdateNewsDto), (req: RequestWithUser, res, next) => {
      this.news.updateNews(req, res, next).catch(next);
    });

    this.router.delete(`${this.path}`, AuthMiddleware(), AdminValidationMiddleware(), ValidationMiddleware(DeleteNewsDto), (req: RequestWithUser, res, next) => {
      this.news.deleteNews(req, res, next).catch(next);
    });
  }
}