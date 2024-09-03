import { type FiatCurrency } from '@/interfaces/currencies.interface';
import { config } from '.';

export const priceCurrencies: FiatCurrency[] = [
  {
    id: 'USD',
    type: 'FIAT',
    code: 'USD',
    name: 'United States dollar',
    symbol: '$',
    flagUrl: `${config.PUBLIC_API_URL}/static/flags/us.svg`,
  },
  {
    id: 'EUR',
    type: 'FIAT',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flagUrl: `${config.PUBLIC_API_URL}/static/flags/eu.svg`,
  },
  {
    id: 'RUB',
    type: 'FIAT',
    code: 'RUB',
    name: 'Russian ruble',
    symbol: '₽',
    flagUrl: `${config.PUBLIC_API_URL}/static/flags/ru.svg`,
  },
];

export const DEFAULT_PRICE_CURRENCY: FiatCurrency = {
  id: 'USD',
  type: 'FIAT',
  code: 'USD',
  name: 'United States dollar',
  symbol: '$',
  flagUrl: `${config.PUBLIC_API_URL}/static/flags/us.svg`,
};
