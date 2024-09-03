import { Request } from 'express';

export interface SwapRatesRequest extends Request {
  body: {
    currencyFrom: string;
    currencyTo: number;
  };
}

export interface SwapRatesResponse {
  currencyFrom: string;
  currencyTo: number;
  rate: number;
}

export interface SwapRatesListing {
  items: SwapRatesResponse[];
}
