import { CreatePayoutDto } from '@/dtos/payouts.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreatePayoutErrorResponse } from '@/interfaces/payouts.interface';
import { PayoutsService } from '@/services/payouts.service';
import { assertNever } from '@/utils/assertNever';
import { Response, NextFunction } from 'express';
import Container from 'typedi';

export class PayoutsController {
  public payouts = Container.get(PayoutsService);

  public async getPayouts(req: RequestWithUser, res: Response, _next: NextFunction) {
    const listing = await this.payouts.getPayoutListingView(req.user.id);

    res.json(listing);
  }

  public async createPayout(req: RequestWithUser, res: Response, _next: NextFunction) {
    const body = req.body;
    if (body instanceof CreatePayoutDto === false) {
      throw new Error('CreatePayoutDto required');
    }

    const createPayoutResult = await this.payouts.createPayout({
      userId: req.user.id,
      value: body.value,
      currencyId: body.currencyId,
      depositAddress: body.depositAddress,
      comment: body.comment,
    });

    switch (createPayoutResult.kind) {
      case 'UNSUPPORTED_CURRENCY_ERR': {
        res.status(400).json({
          kind: 'UNSUPPORTED_CURRENCY_ERR',
          message: 'unsuported currency',
        } satisfies CreatePayoutErrorResponse);
        break;
      }
      case 'INSUFFICIENT_FUNDS_ERR': {
        res.status(400).json({
          kind: 'INSUFFICIENT_FUNDS_ERR',
          message: 'unsufficient funds',
        } satisfies CreatePayoutErrorResponse);
        break;
      }
      case 'INVALID_ADDRESS_ERR': {
        res.status(400).json({
          kind: 'WRONG_CRYPTO_ADDRESS_ERR',
          message: 'wrong crypto address',
        } satisfies CreatePayoutErrorResponse);
        break;
      }
      case 'OK': {
        res.status(201).json(createPayoutResult.payout);
        break;
      }
      default: {
        assertNever(createPayoutResult);
      }
    }
  }
}
