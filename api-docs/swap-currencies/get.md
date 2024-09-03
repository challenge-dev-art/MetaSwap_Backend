# Валюты SWAP

Отобразить список валют запросов на обмен.

**URL** : `/swap-currencies/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [CryptoCurrencyListing](/api-docs/types.md#CryptoCurrencyListing).

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

interface CryptoCurrencyListing {
  items: CryptoCurrency[];
}
```
