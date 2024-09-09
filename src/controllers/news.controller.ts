import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { assertNever } from '@/utils/assertNever';
import { NewsService } from '@/services/news.service';

export class NewsController {
  public news = Container.get(NewsService);

  public async getAllNews(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
      const news = await this.news.getAllNews();
      switch (news.kind) {
        case 'OK': {
          res.status(200).json({ kind: news.kind, news: news.news });
          break;
        }
        case 'NEWS_NOT_FOUND': {
          res.status(400).json({
            kind: 'NEWS_NOT_FOUND',
            message: 'news not found',
          });
          break;
        }
        default: {
          assertNever(news);
        }
      }
  }

  public async getNewsById(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const newsId = Number(req.query.id);
      const news = await this.news.getNewsById(newsId);
      switch (news.kind) {
        case 'OK': {
          res.status(200).json({ kind: news.kind, news: news.news });
          break;
        }
        case 'NEWS_NOT_FOUND': {
          res.status(400).json({
            kind: 'NEWS_NOT_FOUND',
            message: 'news not found',
          });
          break;
        }
        default: {
          assertNever(news);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async createNews(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const createNews = await this.news.createNews({
        userId: req.user.id,
        title: req.body.title,
        content: req.body.content
      });
      switch (createNews.kind) {
        case 'OK': {
          res.status(200).json({ kind: createNews.kind, news: createNews.news });
          break;
        }
        case 'NEWS_NOT_FOUND': {
          res.status(400).json({
            kind: 'NEWS_NOT_FOUND',
            message: 'news not found',
          });
          break;
        }
        default: {
          assertNever(createNews);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async updateNews(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateNews = await this.news.updateNews({
        id: req.body.id,
        userId: req.user.id,
        title: req.body.title,
        content: req.body.content
      });
      switch (updateNews.kind) {
        case 'OK': {
          res.status(200).json({ kind: updateNews.kind, news: updateNews.news });
          break;
        }
        case 'NEWS_NOT_FOUND': {
          res.status(400).json({
            kind: 'NEWS_NOT_FOUND',
            message: 'news not found',
          });
          break;
        }
        default: {
          assertNever(updateNews);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async deleteNews(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleteNews = await this.news.deleteNews({
        id: req.body.id
      });
      switch (deleteNews.kind) {
        case 'OK': {
          res.status(200).json({ kind: deleteNews.kind, news: deleteNews.news });
          break;
        }
        case 'NEWS_NOT_FOUND': {
          res.status(400).json({
            kind: 'NEWS_NOT_FOUND',
            message: 'news not found',
          });
          break;
        }
        default: {
          assertNever(deleteNews);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}