import { CreateAutoconvertRequestDto } from '@/dtos/autoconverts.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateAutoconvertErrorResponse } from '@/interfaces/autoconverts.interface';
import { AutoconvertsService } from '@/services/autoconverts.service';
import { assertNever } from '@/utils/assertNever';
import { NextFunction, Response } from 'express';
import Container from 'typedi';

export class AutoconvertsController {
  public autoconverts = Container.get(AutoconvertsService);

  public async getAutoconverts(req: RequestWithUser, res: Response, next: NextFunction) {
    const listing = await this.autoconverts.getAutoconverts(req.user.id);
    res.json(listing);
  }

  public async createAutoconvert(req: RequestWithUser, res: Response, next: NextFunction) {
    const request = req.body;
    if (request instanceof CreateAutoconvertRequestDto === false) {
      throw new Error('body: CreateAutoconvertRequestDto required');
    }

    const result = await this.autoconverts.createAutoconvert({
      userId: req.user.id,
      currencyIdFrom: request.currencyIdFrom,
      currencyIdTo: request.currencyIdTo,
    });

    switch (result.kind) {
      case 'UNSUPPORTED_CURRENCY_ERR': {
        res.status(400).json({
          kind: 'UNSUPPORTED_CURRENCY_ERR',
          message: 'unsupported currency',
        } satisfies CreateAutoconvertErrorResponse);
        break;
      }
      case 'OK': {
        res.status(201).json(result.autoconvert);
        break;
      }
      default: {
        assertNever(result);
      }
    }
  }
}
