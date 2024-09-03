# Адреса с автоконвертацией

Отобразить список адресов с автоконвертацией.

**URL** : `/autoconverts/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [AutoconvertListing](/api-docs/types.md#AutoconvertListing)

```typescript
interface Autoconvert {
  id: string;
  address: string;
  addressQrUrl: string;
  currencyFrom: CryptoCurrency; // см. /autoconvert-currencies/
  currencyTo: CryptoCurrency;
}

interface AutoconvertListing {
  items: Autoconvert[];
}
```
