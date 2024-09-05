import { CryptoCurrency } from './types';
import { InvoiceSchema } from './schemas/invoice-schema';
import { createHmac } from 'node:crypto';
import { ErrorSchema } from './schemas/error-reponse';
import { ZodType } from 'zod';
import { PayoutSchema } from './schemas/payout-schema';
import { ExchangeSchema, ExchangePairSchema, AverageRateSchem } from './schemas/exchange-schema';

export interface GetInvoiceOpts {
  id?: string;
  idempotencyKey?: string;
}

export interface CreateUnlimitedInvoiceOpts {
  currency: CryptoCurrency;
  description: string;
  idempotencyKey?: string;
  externalId?: string;
  fiatAvailable: boolean;
}

export interface CreateBoundInvoiceOpts {
  lowerBound: number;
  currency: CryptoCurrency;
  description: string;
  idempotencyKey?: string;
  externalId?: string;
  fiatAvailable: boolean;
}

export interface GetPayoutOpts {
  id?: string;
  idempotencyKey?: string;
}

export interface CreatePayoutOpts {
  depositAddress: string;
  amount: number;
  currency: CryptoCurrency;
  comment?: string;
  idempotencyKey?: string;
  externalId?: string;
}

export interface CreateExchangeOpts {
  sourceCurrency: string;
  destinationCurrency: string;
  amount: number;
}

export interface GetAverageRateOpts {
  sourceCurrency: string;
  destinationCurrency: string;
}

export type CallCalypsoResult<T> =
  | {
      kind: 'OK';
      payload: T;
    }
  | {
      kind: 'API_ERROR';
      traceId: string;
      errorCode: string;
      message: string;
    }
  | {
      kind: 'UNKNOWN_ERROR';
      message: string;
    };

const CALYPSO_ENDPOINT = 'https://api.calypso.finance/api/v1/';

// API ver. 2.0
// https://docs.calypso.finance/reference
export class CalypsoApi {
  private _publicKey: string;
  private _secretKey: string;
  private _account: string;

  constructor(publicKey: string, secretKey: string, account: string) {
    this._publicKey = publicKey;
    this._secretKey = secretKey;
    this._account = account;
  }

  /**
   * Get a specific invoice.
   *
   * See: https://docs.calypso.finance/reference/getinvoice
   *
   * @param opts options
   * @returns
   */
  public async getInvoice(opts: GetInvoiceOpts) {
    if (!opts.id && !opts.idempotencyKey) {
      throw new TypeError('id or idempotencyKey key required');
    }

    return await this._callCalypso('invoice', InvoiceSchema, {
      account: this._account,
      payload: {
        id: opts.id,
        idempotencyKey: opts.idempotencyKey,
      },
    });
  }

  /**
   * Create unlimited invoice.
   *
   * See: https://docs.calypso.finance/reference/createunlimitedinvoice
   *
   * @param opts options
   * @returns
   */
  public async createUnlimitedInvoice(opts: CreateUnlimitedInvoiceOpts) {
    return await this._callCalypso('invoice/unlimited/create', InvoiceSchema, {
      account: this._account,
      payload: {
        currency: opts.currency,
        description: opts.description,
        idempotencyKey: opts.idempotencyKey,
        externalId: opts.externalId,
        fiatAvailable: opts.fiatAvailable,
      },
    });
  }

  /**
   * Create bound invoice.
   *
   * See: https://docs.calypso.finance/reference/createboundinvoice
   *
   * @param opts options
   * @returns
   */
  public async createBoundInvoice(opts: CreateBoundInvoiceOpts) {
    return await this._callCalypso('invoice/bound/create', InvoiceSchema, {
      account: this._account,
      payload: {
        lowerBound: opts.lowerBound,
        currency: opts.currency,
        description: opts.description,
        idempotencyKey: opts.idempotencyKey,
        externalId: opts.externalId,
        fiatAvailable: opts.fiatAvailable,
      },
    });
  }

  /**
   * Get a specific payout.
   *
   * See: https://docs.calypso.finance/reference/finddeal
   *
   * @param opts options
   * @returns
   */
  public async getPayout(opts: GetPayoutOpts) {
    if (!opts.id && !opts.idempotencyKey) {
      throw new TypeError('id or idempotencyKey key required');
    }

    return await this._callCalypso('payout', PayoutSchema, {
      account: this._account,
      payload: {
        id: opts.id,
        idempotencyKey: opts.idempotencyKey,
      },
    });
  }

  public async createPayout(opts: CreatePayoutOpts) {
    return await this._callCalypso('payout/create', PayoutSchema, {
      account: this._account,
      payload: {
        depositAddress: opts.depositAddress,
        amount: opts.amount,
        currency: opts.currency,
        comment: opts.comment,
        idempotencyKey: opts.idempotencyKey,
        externalId: opts.externalId,
      },
    });
  }

  /**
   * Pre-calculate the exchange.
   *
   * See: https://docs.calypso.finance/reference/precalculateexchange
   *
   * @param opts preCalculateExchange
   * @returns
   */
  public async preCalculateExchange(opts: CreateExchangeOpts) {
    return await this._callCalypso('exchange/pre-calculate', ExchangeSchema, {
      account: this._account,
      payload: {
        sourceCurrency: opts.sourceCurrency,
        destinationCurrency: opts.destinationCurrency,
        amount: opts.amount,
      },
    });
  }

  /**
   * Get currency pairs.
   *
   * See: https://docs.calypso.finance/reference/getcurrencypair
   *
   * @returns
   */
  public async getCurrencyPairs() {
    console.log('Fanal-getCurrencyPairs');
    // console.log('publicKey: ', this._publicKey);
    // console.log('secretKey: ', this._secretKey);
    // console.log('account: ', this._account);
    return await this._callCalypso('exchange/pairs', ExchangePairSchema, {
      account: this._account,
    });
  }

  /**
   * Get average rate for currency pair.
   *
   * See: https://api.calypso.finance/api/v1/exchange/average-rate
   *
   * @param opts GetAverageRateOpts
   * @returns
   */
  public async getAverageRate(opts: GetAverageRateOpts) {
    return await this._callCalypso('exchange/average-rate', AverageRateSchem, {
      account: this._account,
      payload: {
        sourceCurrency: opts.sourceCurrency,
        destinationCurrency: opts.destinationCurrency,
      },
    });
  }

  /**
   * Create exchange.
   *
   * See: https://docs.calypso.finance/reference/getexchange
   *
   * @param userId GetExchangeOpts
   * @returns
   */
  public async getExchange(id: number) {
    return await this._callCalypso('exchange/get', ExchangeSchema, {
      account: this._account,
      payload: {
        id: id,
      },
    });
  }

  /**
   * Create exchange.
   *
   * See: https://docs.calypso.finance/reference/createexchange
   *
   * @param opts CreateExchangeOpts
   * @returns
   */
  public async createExchange(opts: CreateExchangeOpts) {
    return await this._callCalypso('exchange/create', ExchangeSchema, {
      account: this._account,
      payload: {
        sourceCurrency: opts.sourceCurrency,
        destinationCurrency: opts.destinationCurrency,
        amount: opts.amount,
      },
    });
  }

  private async _callCalypso<T>(route: string, schema: ZodType<T>, body?: object): Promise<CallCalypsoResult<T>> {
    console.log('Signature-callCalypso');
    console.log('publicKey: ', this._publicKey);
    console.log('secretKey: ', this._secretKey);
    console.log('account: ', this._account);
    console.log('route: ', route);
    console.log('body: ', body);
    const timestamp = Date.now();
    const requestBody = body ? { timestamp, ...body } : { timestamp };
    const requestBodyStr = JSON.stringify(requestBody, null, 2);
    //const requestBodyStr = JSON.stringify(requestBody);

    const signature = sign(requestBodyStr, this._secretKey);

    console.log('Signature-callCalypso-timestamp: ', timestamp);
    console.log('Signature-callCalypso-signature: ', signature);
    console.log('Signature-callCalypso-requestBodyStr: ', requestBodyStr);
    console.log('Signature-callCalypso-requestBody: ', requestBody);
    console.log('Endpoin: ', CALYPSO_ENDPOINT + route);

    const response = await fetch(CALYPSO_ENDPOINT + route, {
      method: 'POST',
      headers: {
        accept: '*/*',
        Key: this._publicKey,
        Sign: signature,
        'content-type': 'application/json',
      },
      body: requestBodyStr,
    });

    console.log('Signature-callCalypso-response: ', response);

    let responseBody;
    if (route === 'exchange/pairs') {
      const tempResponseBody = await response.json();

      if (typeof tempResponseBody === 'object' && tempResponseBody !== null && 'currencyPairs' in tempResponseBody) {
        console.log('CurrencyPairs: ', tempResponseBody.currencyPairs);
        responseBody = Object.entries(tempResponseBody.currencyPairs as Record<string, unknown>).map(([key, value]) => ({
          name: key,
          pairs: value,
        }));
        console.log('Signature-callCalypso-responseBody: ', responseBody);
        return {
          kind: 'OK',
          payload: responseBody,
        };
      }
    } else {
      responseBody = await response.json();
      console.log('Signature-callCalypso-responseBody: ', responseBody);

      if (!response.ok) {
        const errorParsingResult = ErrorSchema.safeParse(responseBody);
        if (errorParsingResult.success) {
          const error = errorParsingResult.data;
          return {
            kind: 'API_ERROR',
            traceId: error.traceId,
            errorCode: error.errorCode,
            message: error.message,
          };
        }
      }
      const parsingResult = schema.safeParse(responseBody);
      if (parsingResult.success) {
        return { kind: 'OK', payload: parsingResult.data };
      } else {
        return { kind: 'UNKNOWN_ERROR', message: `failed to parse response: ${parsingResult.error}` };
      }
    }
  }
}

function sign(body: string, secret: string) {
  return createHmac('sha512', secret).update(body).digest('hex');
}
