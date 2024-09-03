import { CryptoCurrency } from './currencies.interface';

export interface Autoconvert {
  id: string;
  address: string;
  addressQrUrl: string;
  currencyFrom: CryptoCurrency; // см. /autoconvert-currencies/
  currencyTo: CryptoCurrency; // см. /autoconvert-currencies/
}

export interface AutoconvertListing {
  items: Autoconvert[];
}

export interface CreateAutoconvertErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
