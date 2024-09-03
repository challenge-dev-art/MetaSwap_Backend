# Список валютных активов

Отобразить список валютных активов на счету пользователя.

**URL** : `/assets/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [AssetListing](/api-docs/types.md#AssetListing)

```typescript
interface CryptoAsset {
  id: string;
  type: 'CRYPTO';
  currencyId: string;
  currency: Currency; // см. types.md#currency
  value: number;
  price: number;
  priceCurrency: FiatCurrency;
}

interface FiatAsset {
  id: string;
  type: 'FIAT';
  currencyId: string;
  currency: Currency; // см. types.md#currency
  value: number;
}

type Asset = CryptoAsset | FiatAsset;

interface AssetListing {
  items: Asset[];
}
```

## Примечания

Возвращается список во всех доступных валютах. Если у пользователя нет средств в той или иной валюте, то возвращается актив валюты со значением 0.
