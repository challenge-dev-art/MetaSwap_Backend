import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { assertNever } from '@/utils/assertNever';
import { FeesService } from '@/services/fees.service';
import { GetFeeDto } from '@/dtos/fees.dto';
import { Fee, FeeType } from '@prisma/client';

export class FeesController {
  public fees = Container.get(FeesService);

  public async getAllFees(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const fees = await this.fees.getAllFees();
      switch (fees.kind) {
        case 'OK': {
          res.status(200).json({ kind: fees.kind, fees: fees.fees });
          break;
        }
        case 'FEES_NOT_FOUND': {
          res.status(400).json({
            kind: 'FEES_NOT_FOUND',
            message: 'fees not found',
          });
          break;
        }
        default: {
          assertNever(fees);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async getFee(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {

      const type = req.query.type;

      const feeType = FeeType[type as keyof typeof FeeType];

      if (!feeType) {
        res.status(400).json({
          kind: 'FEETYPE_NOT_FOUND',
          message: 'correct feeType is required',
        });
      }

      const fee = await this.fees.getFee(feeType);

      switch (fee.kind) {
        case 'OK': {
          res.status(200).json({ kind: fee.kind, fee: fee.fee });
          break;
        }
        case 'FEETYPE_NOT_FOUND': {
          res.status(400).json({
            kind: fee.kind,
            message: 'correct feeType is required',
          });
          break;
        }
        case 'FEE_NOT_FOUND': {
          res.status(400).json({
            kind: fee.kind,
            message: 'fee not found',
          });
          break;
        }
        default: {
          assertNever(fee);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async createFee(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const fee = await this.fees.createFee(body);
      switch (fee.kind) {
        case 'OK': {
          res.status(200).json({ kind: fee.kind, fee: fee.fee });
          break;
        }
        case 'FEE_ALREADY_EXISTS': {
          res.status(400).json({
            kind: fee.kind,
            message: 'fee already exists',
          });
          break;
        }
        default: {
          assertNever(fee);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async updateFee(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      //console.log("req.user: ", req.user);
      const fee = await this.fees.updateFee(body);
      switch (fee.kind) {
        case 'OK': {
          res.status(200).json({ kind: fee.kind, fee: fee.fee });
          break;
        }
        case 'FEE_NOT_FOUND': {
          res.status(400).json({
            kind: fee.kind,
            message: 'fee not found',
          });
          break;
        }
        case 'FEETYPE_NOT_FOUND': {
          res.status(400).json({
            kind: fee.kind,
            message: 'correct feeType is required',
          });
          break;
        }
        default: {
          assertNever(fee);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  public async deleteFee(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type;

      const feeType = FeeType[type as keyof typeof FeeType];

      if (!feeType) {
        res.status(400).json({
          kind: 'FEETYPE_NOT_FOUND',
          message: 'correct feeType is required',
        });
      }

      const fee = await this.fees.deleteFee(feeType);
      switch (fee.kind) {
        case 'OK': {
          res.status(200).json({ kind: fee.kind, fee: fee.fee });
          break;
        }
        case 'FEE_NOT_FOUND': {
          res.status(400).json({
            kind: fee.kind,
            message: 'fee not found',
          });
          break;
        }
        default: {
          assertNever(fee);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}