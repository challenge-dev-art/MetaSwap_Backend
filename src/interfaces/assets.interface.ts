import { FiatCurrency, type Currency } from './currencies.interface';

export interface CryptoAsset {
  id: string;
  type: 'CRYPTO';
  currencyId: string;
  currency: Currency;
  value: number;
  price: number;
  priceCurrency: FiatCurrency;
}

export interface FiatAsset {
  id: string;
  type: 'FIAT';
  currencyId: string;
  currency: Currency;
  value: number;
}

export type Asset = CryptoAsset | FiatAsset;

export interface AssetListing {
  items: Asset[];
}
