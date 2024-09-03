# Отобразить текущего пользователя

Получить подробную информацию о текущем аутентифицированном пользователе.

**URL** : `/account/`

**Метод** : `GET`

**Требуется авторизация** : НЕТ

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [Account](/api-docs/types.md#Account)

```typescript
interface Account {
  id: string; // readable user id
  telegramUsername: string | null; // не у всех пользователей Telegram определен username
  firstName: string;
  lastName: string | null;
  language: string; //  IETF BCP 47 language tag
  email: string | null;
  balance: number;
  balanceCurrencyId: string; // deprecated
  priceCurrency: FiatCurrency;
  auth2fa: boolean; // TOTP enabled (RFC 6238)
  phoneVerifid: boolean;
  nameVerified: boolean;
  addressVerified: boolean;
  createdAt: string; // date ISO 8601
}
```
