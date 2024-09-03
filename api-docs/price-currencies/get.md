# Валюты стоимости активов

Список возвращает список валют для расчета стоимости активов пользователя и стоимости криптовалют.

**URL** : `/price-currencies/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [FiatCurrencyListing](/api-docs/types.md#FiatCurrencyListing)

```typescript
interface FiatCurrency {
  id: string;
  type: 'FIAT';
  code: string;
  name: string;
  symbol: string;
  flagUrl: string;
  decimals: number;
}

interface FiatCurrencyListing {
  items: FiatCurrency[];
}
```
