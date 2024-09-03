# Создать депозит

Создать запрос на пополнения счета текущего ппользователя.

**URL**: `/autoconverts/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

```typescript
interface CreateAutoconvertRequest {
  currencyIdFrom: string; // см. /autoconvert-currencies/
  currencyIdTo: string; // см. /autoconvert-currencies/
}
```

## Успешный ответ

**Условие**: валюты найдены.

**Код** : `201 CREATED`

**Тип ответа**

См. [Autoconvert](/api-docs/types.md#Autoconvert)

```typescript
interface Autoconvert {
  id: string;
  address: string;
  addressQrUrl: string;
  currencyFrom: CryptoCurrency; // см. /autoconvert-currencies/
  currencyTo: CryptoCurrency; // см. /autoconvert-currencies/
}
```

## Ошибки

**Условие** : ID валюты указан неверно или не поддерживается.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateAutoconvertErrorResponse](/api-docs/types.md#CreateAutoconvertErrorResponse)

```typescript
interface CreateAutoconvertErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "UNSUPPORTED_CURRENCY_ERR",
  "message": "unsupported currency"
}
```
