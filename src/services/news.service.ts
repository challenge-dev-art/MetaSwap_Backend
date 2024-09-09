import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { News } from '@prisma/client';
import { assertNever } from '@/utils/assertNever';
import { NewsRequest, UpdateNewsRequest, DeleteNewsRequest } from '@/interfaces/news.interface';

export type GetAllNewsResult = { kind: 'OK'; news: News[] } | { kind: 'NEWS_NOT_FOUND' };

export type GetNewsResult = { kind: 'OK'; news: News } | { kind: 'NEWS_NOT_FOUND' };

export type CreateNewsResult = { kind: 'OK'; news: News } | { kind: 'NEWS_NOT_FOUND' };

export type DeleteNewsResult = { kind: 'OK', news: News } | { kind: 'NEWS_NOT_FOUND' };

@Service()
export class NewsService {
  public news = prisma.news;

  public async getAllNews(): Promise<GetAllNewsResult> {
    const news = await this.news.findMany();
    if (!news) {
      return { kind: 'NEWS_NOT_FOUND' };
    }
    return { kind: 'OK', news };
  }

  public async getNewsById(newsId: number): Promise<GetNewsResult> {
    const news = await this.news.findUnique({
      where: {
        id: newsId,
      },
    });
    if (!news) {
      return { kind: 'NEWS_NOT_FOUND' };
    }
    return { kind: 'OK', news };
  }

  public async createNews(news: NewsRequest): Promise<CreateNewsResult> {
    const createdNews = await this.news.create({
      data: {
        userId: news.userId,
        title: news.title,
        content: news.content
      }
    });
    if (!createdNews) {
      return { kind: 'NEWS_NOT_FOUND' };
    }
    return { kind: 'OK', news: createdNews };
  }

  public async updateNews(news: UpdateNewsRequest): Promise<CreateNewsResult> {
    const existingNews = await this.news.findUnique({
      where: {
        id: news.id,
      },
    });
    if (!existingNews) {
      return { kind: 'NEWS_NOT_FOUND' };
    } else {
      const updatedNews = await this.news.update({
        where: {
          id: news.id,
        },
        data: {
          userId: news.userId,
          title: news.title,
          content: news.content
        }
      });
      if (!updatedNews) {
        return { kind: 'NEWS_NOT_FOUND' };
      }
      return { kind: 'OK', news: updatedNews };
    }
  }

  public async deleteNews(news: DeleteNewsRequest): Promise<DeleteNewsResult> {
    const existingNews = await this.news.findUnique({
      where: {
        id: news.id
      },
    });
    if (!existingNews) {
      return { kind: 'NEWS_NOT_FOUND' };
    } else {
      const deletedNews = await this.news.delete({
        where: {
          id: news.id
        }
      });
      if (deletedNews) {
        return { kind: 'OK', news: deletedNews };
      }
      
    }
  }
}