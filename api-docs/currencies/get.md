# Список валют

Отобразить список поддерживаемых валют.

**URL** : `/currencies/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [CurrencyListing](/api-docs/types.md#CurrencyListing)

```typescript
interface CryptoCurrency {
  id: string;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
}

interface FiatCurrency {
  id: string;
  type: 'FIAT';
  code: string;
  name: string;
  symbol: string;
  flagUrl: string;
  decimals: number;
}

type Currency = CryptoCurrency | FiatCurrency;

interface CurrencyListing {
  items: Currency[];
}
```
