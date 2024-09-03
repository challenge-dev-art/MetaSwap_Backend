import { config } from '@/config';
import { CoinbaseApi } from '@/lib/coinbase-api';
import { assertNever } from '@/utils/assertNever';
import { CurrencyType } from '@prisma/client';
import { Service } from 'typedi';

export type GetCurrencyPriceResult =
  | {
      kind: 'OK';
      price: number;
    }
  | {
      kind: 'NOT_FOUND_ERR';
    };

const TTL = 1000 * 60 * 5; // 5 min

@Service()
export class CoinbaseService {
  private _coinbaseApi = new CoinbaseApi(config.COINBASE_API_HOST);
  private _cache: Map<string, [number, number]> = new Map();

  public async getCurrencyPriceByType(currency: CurrencyType, output: string): Promise<GetCurrencyPriceResult> {
    return await this.getCurrencyPrice(getCoinbaseCurrency(currency), output);
  }

  public async getCurrencyPrice(currency: string, output: string): Promise<GetCurrencyPriceResult> {
    const getSpotPriceResult = await this._coinbaseApi.getSpotPrice(currency, output);
    switch (getSpotPriceResult.kind) {
      case 'NOT_FOUND_ERR': {
        return { kind: 'NOT_FOUND_ERR' };
      }
      case 'OK': {
        return {
          kind: 'OK',
          price: getSpotPriceResult.price,
        };
      }
      default: {
        assertNever(getSpotPriceResult);
      }
    }
  }

  public async getCurrencyPriceByTypeCached(currency: CurrencyType, output: string): Promise<GetCurrencyPriceResult> {
    return await this.getCurrencyPriceCached(getCoinbaseCurrency(currency), output);
  }

  public async getCurrencyPriceCached(currency: string, output: string): Promise<GetCurrencyPriceResult> {
    const cachedPrice = this._readFromCache(currency, output);
    if (cachedPrice !== null) {
      return { kind: 'OK', price: cachedPrice };
    }
    const getCurrencyPriceResult = await this.getCurrencyPrice(currency, output);
    if (getCurrencyPriceResult.kind === 'OK') {
      this._writeToCache(currency, output, getCurrencyPriceResult.price);
    }
    return getCurrencyPriceResult;
  }

  private _readFromCache(currency: string, output: string) {
    const key = `${currency}-${output}`;
    const cachedEntry = this._cache.get(key);
    if (!cachedEntry) {
      return null;
    }
    const [value, expires] = cachedEntry;
    if (expires <= Date.now()) {
      return null;
    }
    return value;
  }

  private _writeToCache(currency: string, output: string, value) {
    const key = `${currency}-${output}`;
    this._cache.set(key, [value, Date.now() + TTL]);
  }
}

function getCoinbaseCurrency(currency: CurrencyType): string {
  switch (currency) {
    case CurrencyType.BTC: {
      return 'BTC';
    }
    case CurrencyType.ETH: {
      return 'ETH';
    }
    case CurrencyType.LTC: {
      return 'LTC';
    }
    case CurrencyType.TRX: {
      return 'TRX';
    }
    case CurrencyType.USDT:
    case CurrencyType.USDT_TRX: {
      return 'USDT';
    }
    default: {
      assertNever(currency);
    }
  }
}
