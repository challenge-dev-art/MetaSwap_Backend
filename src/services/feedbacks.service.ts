import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { Feedback } from '@prisma/client';
import { assertNever } from '@/utils/assertNever';
import { PostFeedbackRequest, DeleteFeedbackRequest } from '@/interfaces/feedback.interface';

export type FeedbackResult = { kind: 'OK'; feedback: Feedback } | { kind: 'FEEDBACK_NOT_FOUND' };

export type GetFeedbackResult = { kind: 'OK'; feedbacks: Feedback[] } | { kind: 'FEEDBACK_NOT_FOUND' };

export type DeleteFeedbackResult = { kind: 'OK', feedback: Feedback } | { kind: 'FEEDBACK_NOT_FOUND' };

@Service()
export class FeedbacksService {
  public feedback = prisma.feedback;

  public async getAllFeedback(): Promise<GetFeedbackResult> {

    const feedbacks = await this.feedback.findMany();

    if (!feedbacks) {
      return { kind: 'FEEDBACK_NOT_FOUND' };
    }
    
    return { kind: 'OK', feedbacks };
  
  }

  public async getFeedback(userId: number): Promise<GetFeedbackResult> {
    const feedbacks = await this.feedback.findMany({
      where: {
        userId: userId,
      }
    });

    console.log("feedbacks", feedbacks);

    if (!feedbacks) {
      return { kind: 'FEEDBACK_NOT_FOUND' };
    }

    return { kind: 'OK', feedbacks };
  }

  public async postFeedback(opts: PostFeedbackRequest): Promise<FeedbackResult> {

    const feedback = await this.feedback.create({
      data: {
        userId: opts.userId,
        title: opts.title,
        content: opts.content,
      }
    });

    if (feedback) {
      return { kind: 'OK', feedback };
    } else {
      return { kind: 'FEEDBACK_NOT_FOUND' };
    }

  }

  public async deleteFeedback(feedback: DeleteFeedbackRequest): Promise<DeleteFeedbackResult> {
    const existingFeedbacks = await this.feedback.findMany({
      where: {
        id: feedback.id
      }
    });
    if (!existingFeedbacks) {
      return { kind: 'FEEDBACK_NOT_FOUND' };
    } else {
      const deletedFeedbacks = await this.feedback.delete({
        where: {
          id: feedback.id
        }
      });
      if (deletedFeedbacks) {
        return { kind: 'OK', feedback: deletedFeedbacks };
      } else {
        return { kind: 'FEEDBACK_NOT_FOUND' };
      }
    }
  }
}