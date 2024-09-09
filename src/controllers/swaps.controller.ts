//import { NextFunction, Response } from 'express';
import { NextFunction, Response, Request } from 'express';
import { RequestWithUser, SwapPreDisplayRequest } from '@/interfaces/swaps.interface';
import { prisma } from '@/prisma-client';
import Container from 'typedi';
import { SwapsService } from '@services/swaps.service';
import { CreateSwapsDto } from '@dtos/swaps.dto';
import { CreatePayoutErrorResponse } from '@interfaces/payouts.interface';
import { SwapRatesRequest, SwapRatesResponse } from '@/interfaces/swap-rates.interface';
import { assertNever } from '@utils/assertNever';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
export class SwapsController {
  public swaps = Container.get(SwapsService);
  public getSwaps = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      //const listing = await this.swaps.getSwaps(_req.user.id);
      const body = Number(_req.query.id);
      const getSwapResult = await this.swaps.getSwaps(body);
      console.log('getSwapResult: ', getSwapResult);
      switch (getSwapResult.kind) {
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
          res.status(201).json(getSwapResult.swap);
          break;
        }
        case 'API_ERROR': {
          res.status(400).json({
            kind: getSwapResult.kind,
            message: getSwapResult.message,
          });
          break;
        }
        default: {
          assertNever(getSwapResult);
        }
      }
      // res.json(getSwapResult);
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
    console.log('createSwapsDto: ', createSwapsDto);
    // Валидируем объект
    const errors = await validate(createSwapsDto);
    console.log('errors: ', errors);
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
      amount: body.amount,
      sourceCurrency: body.sourceCurrency,
      destinationCurrency: body.destinationCurrency,
    });

    console.log('createSwapResult: ', createSwapResult);

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
        res.status(201).json(createSwapResult);
        break;
      }
      case 'API_ERROR': {
        res.status(400).json({
          kind: createSwapResult.kind,
          message: createSwapResult.message,
        } satisfies CreatePayoutErrorResponse);
        break;
      }
      default: {
        assertNever(createSwapResult);
      }
    }
  };

  public getCurrencyPairs = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      console.log('Controller-getCurrencyPairs');

      const listing = await this.swaps.getCurrencies();
      console.log('listing: ', listing);
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public getRates = async (_req: SwapRatesRequest, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      const { sourceCurrency, destinationCurrency } = _req.body;
      console.log(sourceCurrency, destinationCurrency);
      const getRateResult = await this.swaps.getRates(sourceCurrency, destinationCurrency);
      console.log('getRateResult: ', getRateResult);
      res.json(getRateResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public preCalculate = async (_req: SwapPreDisplayRequest, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      const { sourceCurrency, destinationCurrency, amount } = _req.body;
      console.log(sourceCurrency, destinationCurrency, amount);
      const preCalculateResult = await this.swaps.preCalculate(sourceCurrency, destinationCurrency, amount);
      console.log('preCalculateResult: ', preCalculateResult);
      res.json(preCalculateResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public swapUpdate = async (_req: RequestWithUser, res: Response, _next?: NextFunction): Promise<void> => {
    try {
      const { id, state } = _req.body;
      const userId = _req.user.id;
      console.log('userId: ', userId);
      console.log(state, userId);
      const swapUpdateResult = await prisma.swaps.update({
        where: {
          id: id
        },
        data: {
          state: state,
        }
      })
        const result = {...swapUpdateResult, hashId: swapUpdateResult.hashId.toString()};
        console.log(result);
        //res.json(result);
        res.json({ kind: 'OK', user: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}