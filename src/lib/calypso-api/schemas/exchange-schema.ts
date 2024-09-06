import { number, object, string, optional, boolean, array, date} from 'zod';
import { ExchangeStateSchema } from './exchange-state-schema';

export const ExchangeSchema = object({
  id: number(),
  account: string(),
  sourceCurrency: string(),
  sourceAmount: number(),
  destinationCurrency: string(),
  destinationAmount: number(),
  state: ExchangeStateSchema,
  createdDate: string(),
});

export const NetworkDataSchema = object({
  frontName: string(),
  type: optional(string()),
});

export const CurrencyPairSchema = object({ name: string(), paires: array(string()) });

// export const CurrencyPairSchema = object({
//   name: string(),
//   feeCurrencyName: string(),
//   coidId: string(),
//   networkData: NetworkDataSchema,
//   scale: number(),
//   blockchainScale: number(),
//   garbageAmount: optional(number()),
//   crypto: boolean(),
//   blockchainName: string(),
//   contract: optional(string()),
//   enabled: boolean(),
//   active: boolean(),
// });

export const ExchangePairSchema = object({
  currencyPairs: array(CurrencyPairSchema),
});

export const AverageRateSchem = object({
  rate: number(),
});

export const PreCalculateExchangeSchema = object({
  sourceCurrency: string(),
  destinationCurrency: string(),
  amount: number(),
});
