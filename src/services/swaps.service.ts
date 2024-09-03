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

export interface CreateSwapOpts {
  userId: number;
  value: number;
  currencyFromId: string;
  currencyToId: string;
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

export type GetCurrencyPairResult =
  | {
      kind: 'OK';
      currencyPairs: SwapCurrencyPairs;
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

  public async getSwaps(userId: number): Promise<SwapsListing> {
    const swaps = await prisma.swaps.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        currencyToId: true,
        currencyFromId: true,
        value: true,
      },
    });

    const items: Swap[] = swaps.map((swapRow): Swap => {
      const swap: Swap = {
        id: swapRow.id.toString(),
        currencyFromId: swapRow.currencyFromId,
        currencyToId: swapRow.currencyToId,
        userId: userId,
        value: swapRow.value,
      };
      return swap;
    });

    return { items } satisfies SwapsListing;
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

    const currencyIdFrom = swapCurrencies.find(currency => currency.type === 'CRYPTO' && currency.id === opts.currencyFromId);
    const currencyIdTo = swapCurrencies.find(currency => currency.type === 'CRYPTO' && currency.id === opts.currencyToId);

    if (!currencyIdFrom || currencyIdFrom.type !== 'CRYPTO') {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    if (!currencyIdTo || currencyIdTo.type !== 'CRYPTO') {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    // TODO: api

    const createdSwap = await prisma.swaps.create({
      data: {
        currencyFromId: opts.currencyFromId as CurrencyType,
        currencyToId: opts.currencyToId as CurrencyType,
        value: opts.value,
        userId: opts.userId,
      },
    });

    const swap: Swap = {
      id: createdSwap.id.toString(),
      currencyFromId: createdSwap.currencyFromId,
      currencyToId: createdSwap.currencyToId,
      userId: createdSwap.userId,
      value: createdSwap.value,
    };

    return { kind: 'OK', swap: swap };
  }

  public async getCurrencies(): Promise<GetCurrencyPairResult> {
    try {
      const ret = await this._calypso.getCurrencyPairs();
      let currencyPairs: SwapCurrencyPairs;
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
