# Изменить валюту баланса пользователя

**URL** : `/account/update-currency/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [UpdateAccountCurrencyRequest](/api-docs/types.md#UpdateAccountCurrencyRequest)

```typescript
interface UpdateAccountCurrencyRequest {
  currencyId: string; // см. /price-currencies/
}
```

## Успешный ответ

**Условие**: предоставленные данные действительны, пользователь аутентифицирован.

**Код**: `200 OK`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess)

```typescript
interface ResponseSuccess {
  kind: 'OK';
}
```

**Пример ответа**

```json
{
  "message": "OK"
}
```

## Ошибки

**Условие**: предоставленные данные недействительны, пользователь не аутентифицирован.

**Код**: `400 BAD REQUEST`

**Тип ответа**

См. [UpdateAccountCurrencyErrorResponse](/api-docs/types.md#UpdateAccountCurrencyErrorResponse)

```typescript
interface UpdateAccountCurrencyErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

**Коды ошибок**

| Код                          | Описание                  |
| ---------------------------- | ------------------------- |
| **UNSUPPORTED_CURRENCY_ERR** | Валюта не поддерживается. |
