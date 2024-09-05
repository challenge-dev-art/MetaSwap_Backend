import { Request } from 'express';

export interface SwapRatesRequest extends Request {
  body: {
    sourceCurrency: string;
    destinationCurrency: string;
  };
}

export interface SwapRatesResponse {
  currencyFrom: string;
  currencyTo: string;
  rate: number;
}

export interface SwapRatesListing {
  items: SwapRatesResponse[];
}
