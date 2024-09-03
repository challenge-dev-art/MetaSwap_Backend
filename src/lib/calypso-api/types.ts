import * as z from 'zod';
import { InvoiceSchema } from './schemas/invoice-schema';
import { CryptoCurrencySchema } from './schemas/crypto-currency-schema';
import { CurrencyPairSchema } from './schemas/exchange-schema';

export type Invoice = z.infer<typeof InvoiceSchema>;

export type CryptoCurrency = z.infer<typeof CryptoCurrencySchema>;

export type SwapCurrencyPairs = z.infer<typeof CurrencyPairSchema>;
