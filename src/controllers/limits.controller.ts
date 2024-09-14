import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { assertNever } from '@/utils/assertNever';
import { LimitsService } from '@/services/limits.service';
import { LimitRequest, UpdateLimitRequest } from '@/interfaces/limits.interface';

export class LimitsController {
  public limits = Container.get(LimitsService);

  public async getLimits(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const limits = await this.limits.getLimits();
    switch (limits.kind) {
      case 'OK': {
        res.status(200).json({ kind: limits.kind, limits: limits.limits });
        break;
      }
      case 'LIMITS_NOT_FOUND': {
        res.status(400).json({
          kind: 'LIMITS_NOT_FOUND',
          message: 'limits not found',
        });
        break;
      }
      default: {
        assertNever(limits);
      }
    }
  }

  public async createLimit(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const createLimit = await this.limits.createLimit({
        checkVerification: req.body.checkVerification,
        limitType: req.body.limitType,
        currencyId: req.body.currencyId,
        amount: req.body.amount,
      });
      switch (createLimit.kind) {
        case 'OK': {
          res.status(200).json({ kind: createLimit.kind, limit: createLimit.limit });
          break;
        }
        case 'LIMIT_ALREADY_EXISTS': {
          res.status(400).json({
            kind: 'LIMIT_ALREADY_EXISTS',
            message: 'limit already exists',
          });
          break;
        }
        default: {
          assertNever(createLimit);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async updateLimit(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateLimit = await this.limits.updateLimit({
        id: req.body.id,
        checkVerification: req.body.checkVerification,
        limitType: req.body.limitType,
        currencyId: req.body.currencyId,
        amount: req.body.amount,
      });
      switch (updateLimit.kind) {
        case 'OK': {
          res.status(200).json({ kind: updateLimit.kind, limit: updateLimit.limit });
          break;
        }
        case 'LIMIT_NOT_FOUND': {
          res.status(400).json({
            kind: 'LIMIT_NOT_FOUND',
            message: 'limit not found',
          });
          break;
        }
        default: {
          assertNever(updateLimit);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}