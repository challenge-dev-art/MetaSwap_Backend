import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/swaps.interface';
import Container from 'typedi';
import { SwapsService } from '@services/swaps.service';
import { CreateSwapsDto } from '@dtos/swaps.dto';
import { CreatePayoutErrorResponse } from '@interfaces/payouts.interface';
import { assertNever } from '@utils/assertNever';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class SwapsController {
  public swaps = Container.get(SwapsService);
  public getSwaps = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      const listing = await this.swaps.getSwaps(_req.user.id);
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public createSwaps = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    const body = _req.body;
    console.log('--------------------------------------------');
    console.log(body);
    console.log('--------------------------------------------');
    // if (body instanceof CreateSwapsDto === false) {
    //   throw new Error('CreatePayoutDto required');
    // }

    const createSwapsDto = plainToClass(CreateSwapsDto, body);

    // Валидируем объект
    const errors = await validate(createSwapsDto);
    if (errors.length > 0) {
      res.status(400).json({
        kind: 'VALIDATION_ERROR',
        message: 'Данные не прошли валидацию',
        errors: errors,
      });
      return;
    }

    const createSwapResult = await this.swaps.createSwaps({
      userId: _req.user.id,
      value: body.value,
      currencyFromId: body.currencyFromId,
      currencyToId: body.currencyToId,
    });

    switch (createSwapResult.kind) {
      case 'UNSUPPORTED_CURRENCY_ERR': {
        res.status(400).json({
          kind: 'UNSUPPORTED_CURRENCY_ERR',
          message: 'unsuported currency',
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
        res.status(201).json(createSwapResult.swap);
        break;
      }
      default: {
        assertNever(createSwapResult);
      }
    }
  };

  public getCurrencyPairs = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      const listing = await this.swaps.getCurrencies();
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
