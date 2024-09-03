# Создать внутренний перевод

Перевести средства со счета текущего пользователя на счет другого пользователя Metaswap.

В случае успешного создания перевода незамедлительно создаются транзакции:

- `INTERNAL_TRANSFER_OUTPUT` у отправителя;
- `INTERNAL_TRANSFER_INPUT` у получателя.

См. [история транзакций](/api-docs/transactions/get.md).

**URL** : `/internal-transfers/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [CreateInternalTransferRequest](/api-docs/types.md#CreateInternalTransferRequest)

```typescript
interface CreateInternalTransferRequest {
  userTo: string; // получатель средств; cм. /account
  currencyId: string; // см. /currencies
  value: number; // сумма перевода; например, 1.53 BTC
}
```

## Успешный ответ

**Условие**: получатель найден, средств достаточно для перевода у отправителя.

**Код** : `201 CREATED`

**Тип ответа**

См. [CreateInternalTransferSuccessResponse](/api-docs/types.md#CreateInternalTransferSuccessResponse)

```typescript
interface CreateInternalTransferSuccessResponse {
  kind: 'OK';
  transactionId: string; // см. /transactions
}
```

## Ошибки

**Условие** : У пользователяя недостаточно средств.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateInternalTransferErrorResponse](/api-docs/types.md#CreateInternalTransferErrorResponse)

```typescript
interface CreateInternalTransferErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "INSUFFICIENT_FUNDS_ERR",
  "message": "недостаточно средств на счету пользователя"
}
```

### Или

**Условие** : Получатель средств не найден.

**Код** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateInternalTransferErrorResponse](/api-docs/types.md#CreateInternalTransferErrorResponse)

```typescript
interface CreateInternalTransferErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "INTERNAL_USER_NOT_FOUND_ERR",
  "message": "получатель средств не найден"
}
```

### Или

**Условие** : ID валюты не найден.

**Код** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateInternalTransferErrorResponse](/api-docs/types.md#CreateInternalTransferErrorResponse)

```typescript
interface CreateInternalTransferErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "UNSUPPORTED_CURRENCY_ERR",
  "message": "ID валюты не найден"
}
```

## Примечания

См. также:

- [Отобразить текущего пользователя](/api-docs/account/get.md): `GET /account`
- [Список валютных активов](/api-docs/assets/get.md): `POST /assets/`
- [Список валют](/api-docs/currencies/get.md): `GET /currencies/`
- [История транзакций](/api-docs/transactions/get.md): `GET /transactions/`
