# Создать исходящий платеж

Создать запрос на вывод средств текущего ппользователя.

**URL**: `/payouts/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [CreatePayoutRequest](/api-docs/types.md#CreatePayoutRequest)

```typescript
interface CreatePayoutRequest {
  depositAddress: string;
  comment: string; // не более чем 200 символов
  currencyId: string; // см. /payout-currencies/
  value: number;
}
```

## Успешный ответ

**Условие**: валюта найдена.

**Код** : `201 CREATED`

**Тип ответа**

См. [Payout](/api-docs/types.md#Payout)

```typescript
// См. https://docs.calypso.finance/reference/enum-description#payout-state
type PayoutState =
  | 'CREATION_IN_PROGRESS' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'PENDING_CONFIRMATION' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'CONFIRMED' // Создано
  | 'IN_PROGRESS' // В ожидании
  | 'COMPLETED' // Завершено
  | 'FAILED' // Ошибка
  | 'CANCELED'; // Отменено

interface Payout {
  id: string;
  depositAddress: string; // адрес, на который необходимо перечислить средства отправителю
  amount: number;
  currencyId: string; // см. /payout-currencies/
  comment: string;
  status: PayoutState;
  transactionId: string;
}
```

## Ошибки

**Условие** : У пользователяя недостаточно средств.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreatePayoutErrorResponse](/api-docs/types.md#CreatePayoutErrorResponse)

```typescript
interface CreatePayoutErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'WRONG_CRYPTO_ADDRESS_ERR';
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

**Условие** : ID валюты указан неверно или не поддерживается.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreatePayoutErrorResponse](/api-docs/types.md#CreatePayoutErrorResponse)

```typescript
interface CreatePayoutErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'WRONG_CRYPTO_ADDRESS_ERR';
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

**Условие** : Неверный формат адреса получателя средств.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreatePayoutErrorResponse](/api-docs/types.md#CreatePayoutErrorResponse)

```typescript
interface CreatePayoutErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'WRONG_CRYPTO_ADDRESS_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "WRONG_CRYPTO_ADDRESS_ERR",
  "message": "wrong crypto address"
}
```
