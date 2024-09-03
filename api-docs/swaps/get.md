# Список запросов на обмен

**URL** : `/swaps/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [SwapListing](/api-docs/types.md#SwapListing)

```typescript
interface Swap {
  id: string;
  currencyFrom: CryptoCurrency; // см. /swap-currencies/
  currencyTo: CryptoCurrency; // см. /swap-currencies/
  fee: number;
  feeCurrency: CryptoCurrency; // см. /swap-currencies/
}

interface SwapListing {
  items: Swap[];
}
```
