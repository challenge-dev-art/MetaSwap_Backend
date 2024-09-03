# Создать запрос на обмен

**URL** : `/swaps/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

## Успешный ответ

**Условие**: валюты указаны верно, на счету достаточно средств, напрвление перевода существует.

**Код** : `201 CREATED`

**Тип ответа**

См. [CreateSwapRequest](/api-docs/types.md#CreateSwapRequest)

```typescript
interface CreateSwapRequest {
  currencyFromId: string;
  currencyToId: string;
  value: number;
}
```

## Ошибки

**Условие** : У пользователяя недостаточно средств.

**Code** : `400 BAD REQUEST`

**Тип ответа**

```typescript
interface CreateSwapErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'SWAP_DIRECTION_NOT_FOUND_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "INSUFFICIENT_FUNDS_ERR",
  "message": "insufficient funds"
}
```

### Или

**Условие** : ID валюты указан неверно или не поддерживается.

**Code** : `400 BAD REQUEST`

**Тип ответа**

```typescript
interface CreateSwapErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'SWAP_DIRECTION_NOT_FOUND_ERR';
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

### Или

**Условие** : направление обмена не найдено.

**Code** : `400 BAD REQUEST`

**Тип ответа**

```typescript
interface CreateSwapErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'SWAP_DIRECTION_NOT_FOUND_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "SWAP_DIRECTION_NOT_FOUND_ERR",
  "message": "swap direction not found"
}
```
