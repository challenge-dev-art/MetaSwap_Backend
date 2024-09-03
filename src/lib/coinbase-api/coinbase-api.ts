import { TokenPriceResponseSchema } from './schemas';

export type GetSpotPriceResult =
  | {
      kind: 'OK';
      price: number;
    }
  | {
      kind: 'NOT_FOUND_ERR';
    };

const DEFAULT_COINBASE_API_HOST = 'https://api.coinbase.com';

export class CoinbaseApi {
  private _apiHost: string;

  constructor(apiHost?: string) {
    this._apiHost = apiHost ?? DEFAULT_COINBASE_API_HOST;
  }

  async getSpotPrice(base: string, currency: string): Promise<GetSpotPriceResult> {
    const endpoint = `${this._apiHost}/v2/prices/${encodeURIComponent(base)}-${encodeURIComponent(currency)}/spot`;
    const response = await fetch(endpoint);

    if (response.ok) {
      const body = await response.json();
      const apiResponse = TokenPriceResponseSchema.parse(body);
      const priceStr = apiResponse.data.amount;
      const priceFloat = parseFloat(priceStr);
      return { kind: 'OK', price: priceFloat };
    } else if (response.status === 404) {
      return { kind: 'NOT_FOUND_ERR' };
    } else {
      throw new Error(`failed to fetch spot price ${response.statusText}`);
    }
  }
}
