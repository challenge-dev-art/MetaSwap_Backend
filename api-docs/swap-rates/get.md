# Курсы валют SWAP

**URL** : `/swap-rates/`

**Параметры запроса**

| Наименование    | Обязательный | Описание         |
| --------------- | ------------ | ---------------- |
| `currency-from` | НЕТ          | Исходная валюта. |
| `currency-to`   | НЕТ          | Целевая валюта.  |

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [SwapRateListing](/api-docs/types.md#SwapRateListing).

```typescript
interface SwapRate {
  id: string;
  currencyFrom: CryptoCurrency; // см. /swap-currencies/
  currencyTo: CryptoCurrency; // см. /swap-currencies/
  rate: number;
}

interface SwapRateListing {
  items: SwapRate[];
}
```
