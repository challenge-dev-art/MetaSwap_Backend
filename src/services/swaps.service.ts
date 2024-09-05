import Container, { Service } from 'typedi';
import { CalypsoService } from './calypso.service';
import { CurrencyType } from '@prisma/client';
import { Swap, SwapsListing } from '@/interfaces/swaps.interface';
import { prisma } from '@/prisma-client';
import { Currency } from '@/interfaces/currencies.interface';
import { swapCurrencies } from '@/config/swap-currencies';
import { logger } from '@/utils/logger';
import { assertNever } from '@/utils/assertNever';
import { SwapCurrencyPairs } from '@/lib/calypso-api/types';
import { CreateSwapsDto } from '@/dtos/swaps.dto';

export interface CreateSwapOpts {
  userId: number;
  amount: number;
  sourceCurrency: string;
  destinationCurrency: string;
}
export type CreateSwapResult =
  | {
      kind: 'OK';
      swap: Swap;
    }
  | {
      kind: 'UNSUPPORTED_CURRENCY_ERR';
    }
  | {
      kind: 'INVALID_ADDRESS_ERR';
    };
export type GetSwapResult =
  | {
      kind: 'OK';
      swap: Swap;
    }
  | {
      kind: 'UNSUPPORTED_CURRENCY_ERR';
    }
  | {
      kind: 'INVALID_ADDRESS_ERR';
    };

export type GetCurrencyPairResult =
  | {
      kind: 'OK';
      currencyPairs: SwapCurrencyPairs[];
    }
  | {
      kind: 'UNKNOWN_ERROR';
    }
  | {
      kind: 'SOMETHING_WENT_WRONG';
    };

@Service()
export class SwapsService {
  private _currencyIdToDecimals: Map<CurrencyType, number>;
  private _calypso = Container.get(CalypsoService);
  private _tagName = 'SwapsService';
  constructor() {
    this._currencyIdToDecimals = new Map(swapCurrencies.map(currency => [currency.id, currency.decimals]));
  }

  // public async getSwaps(userId: number): Promise<SwapsListing> {
  //   const swaps = await prisma.swaps.findMany({
  //     where: {
  //       userId,
  //     },
  //     select: {
  //       id: true,
  //       currencyToId: true,
  //       currencyFromId: true,
  //       value: true,
  //     },
  //   });

  //   const items: Swap[] = swaps.map((swapRow): Swap => {
  //     const swap: Swap = {
  //       id: swapRow.id.toString(),
  //       currencyFromId: swapRow.currencyFromId,
  //       currencyToId: swapRow.currencyToId,
  //       userId: userId,
  //       value: swapRow.value,
  //     };
  //     return swap;
  //   });

  //   return { items } satisfies SwapsListing;
  // }
  public async getSwaps(id: number): Promise<GetSwapResult> {
    try {
      console.log('id: ', id);
      const ret = await this._calypso.getExchange(id);
      console.log('ret: ', ret);
      switch (ret.kind) {
        case 'API_ERROR': {
          //throw new Error(`${ret.errorCode} ${ret.traceId} ${ret.message}`);
          return { kind: 'API_ERROR', message: ret.message };
        }
        case 'UNKNOWN_ERROR': {
          throw new Error(ret.message);
        }
        case 'OK': {
          //currencyPairs = ret.payload;
          break;
        }
        default: {
          assertNever(ret);
        }
      }
    } catch (error) {
      logger.error(`${this._tagName} failed to get exchange for swap: ${error}`);
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }
  }

  public async createSwaps(opts: CreateSwapOpts): Promise<CreateSwapResult> {
    const user = await prisma.user.findUnique({
      where: {
        id: opts.userId,
      },
      select: {
        publicId: true,
        telegramUsername: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const sourceCurrency = swapCurrencies.find(currency => currency.type === 'CRYPTO' && currency.id === opts.sourceCurrency);
    const destinationCurrency = swapCurrencies.find(currency => currency.type === 'CRYPTO' && currency.id === opts.destinationCurrency);

    if (!sourceCurrency || sourceCurrency.type !== 'CRYPTO') {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    if (!destinationCurrency || destinationCurrency.type !== 'CRYPTO') {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    // TODO: api
    const opts_send = {
      sourceCurrency: opts.sourceCurrency,
      destinationCurrency: opts.destinationCurrency,
      amount: opts.amount,
    };
    try {
      const ret = await this._calypso.createExchange(opts_send);
      console.log('ret: ', ret);

      switch (ret.kind) {
        case 'API_ERROR': {
          //throw new Error(`${ret.errorCode} ${ret.traceId} ${ret.message}`);
          return { kind: 'API_ERROR', message: ret.message };
        }
        case 'UNKNOWN_ERROR': {
          throw new Error(ret.message);
        }
        case 'OK': {
          //currencyPairs = ret.payload;
          break;
        }
        default: {
          assertNever(ret);
        }
      }

      if (ret && typeof ret !== 'undefined') {
        // return {
        //   kind: 'OK',
        //   ret.payload,
        // };
      }
      //return { kind: 'SOMETHING_WENT_WRONG' };
    } catch (error) {
      logger.error(`${this._tagName} failed to create exchange for swap: ${error}`);
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    const createdSwap = await prisma.swaps.create({
      data: {
        currencyFromId: opts.currencyFromId as CurrencyType,
        currencyToId: opts.currencyToId as CurrencyType,
        value: opts.value,
        userId: opts.userId,
        state: 'IN_PROGRESS',
      },
    });

    const swap: Swap = {
      id: createdSwap.id.toString(),
      currencyFromId: createdSwap.currencyFromId,
      currencyToId: createdSwap.currencyToId,
      userId: createdSwap.userId,
      value: createdSwap.value,
      state: createdSwap.state,
    };

    return { kind: 'OK', swap: swap };
  }

  public async getCurrencies(): Promise<GetCurrencyPairResult> {
    try {
      console.log('Service-getCurrencies');

      const ret = await this._calypso.getCurrencyPairs();

      console.log('ret: ', ret);

      // let currencyPairs: SwapCurrencyPairs[];
      let currencyPairs;
      switch (ret.kind) {
        case 'API_ERROR': {
          throw new Error(`${ret.errorCode} ${ret.traceId} ${ret.message}`);
        }
        case 'UNKNOWN_ERROR': {
          throw new Error(ret.message);
        }
        case 'OK': {
          currencyPairs = ret.payload;
          break;
        }
        default: {
          assertNever(ret);
        }
      }

      if (ret && typeof ret !== 'undefined') {
        return {
          kind: 'OK',
          currencyPairs,
        };
      }
      return { kind: 'SOMETHING_WENT_WRONG' };
    } catch (e) {
      logger.error(`[${this._tagName}] failed to get currency pairs for swap: ${e}`);
      return { kind: 'UNKNOWN_ERROR' };
    }
  }
}
