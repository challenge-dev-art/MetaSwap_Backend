import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { assertNever } from '@/utils/assertNever';
import { FeedbacksService } from '@/services/feedbacks.service';

export class FeedbackController {
  public feedbacks = Container.get(FeedbacksService);

  public async getAllFeedback(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedbacks = await this.feedbacks.getAllFeedback();
      
      switch (feedbacks.kind) {
        case 'OK': {
          res.status(200).json({ kind: feedbacks.kind, feedbacks: feedbacks.feedbacks });
          break;
        }
        case 'FEEDBACK_NOT_FOUND': {
          res.status(400).json({
            kind: 'FEEDBACK_NOT_FOUND',
            message: 'feedback not found',
          });
          break;
        }
        default: {
          assertNever(feedbacks);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async getFeedback(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      const feedbacks = await this.feedbacks.getFeedback(userId);
      
      switch (feedbacks.kind) {
        case 'OK': {
          res.status(200).json({ kind: feedbacks.kind, feedbacks: feedbacks.feedbacks });
          break;
        }
        case 'FEEDBACK_NOT_FOUND': {
          res.status(400).json({
            kind: 'FEEDBACK_NOT_FOUND',
            message: 'feedback not found',
          });
          break;
        }
        default: {
          assertNever(feedbacks);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async postFeedback(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const feedbacks = await this.feedbacks.postFeedback({
        userId: req.user.id,
        title: body.title,
        content: body.content
      });

      switch (feedbacks.kind) {
        case 'OK': {
          res.status(201).json({ kind: feedbacks.kind, feedback: feedbacks.feedback});
          break;
        }
        case 'FEEDBACK_NOT_FOUND': {
          res.status(400).json({
            kind: 'FEEDBACK_NOT_FOUND',
            message: 'feedback not found',
          });
          break;
        }
        default: {
          assertNever(feedbacks);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async deleteFeedback(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {

      const feedbacks = await this.feedbacks.deleteFeedback({
        id: req.body.id
      });
      switch (feedbacks.kind) {
        case 'OK': {
          res.status(200).json({ 
            kind: feedbacks.kind, 
            feedback: feedbacks.feedback
          });
          break;
        }
        case 'FEEDBACK_NOT_FOUND': {
          res.status(400).json({
            kind: 'FEEDBACK_NOT_FOUND',
            message: 'feedback not found',
          });
          break;
        }
        default: {
          assertNever(feedbacks);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}