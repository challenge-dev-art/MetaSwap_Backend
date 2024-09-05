import { CurrencyType } from '@prisma/client';

export interface CryptoCurrency {
  id: CurrencyType;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
}

export interface FiatCurrency {
  id: string;
  type: 'FIAT';
  code: string;
  name: string;
  symbol: string;
  flagUrl: string;
  decimals?: number;
}

export type Currency = CryptoCurrency | FiatCurrency;

export interface CurrencyListing {
  items: Currency[];
}

export interface FiatCurrencyListing {
  items: FiatCurrency[];
}
