# Список пополнений

Отобразить список пополнений

**URL** : `/deposits/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [DepositListing](/api-docs/types.md#DepositListing)

```typescript
// См. https://docs.calypso.finance/reference/enum-description#invoice-state
type DepositState =
  | 'PENDING_PAYMENT' // Не оплачено
  | 'MEM_POOL_FOUND' // Не оплачено
  | 'PAID' // Оплачено
  | 'PENDING_INTERVENTION' // На рассмотрении
  | 'COMPLETED' // Оплачено
  | 'CANCEL' // Отменено
  | 'ARCHIVED' // Архивировано
  | 'DECLINED' // Заблокированно
  | 'PENDING_COMPLIANCE_CHECK' // На проверке
  | 'EXPIRED'; // Истек

interface Deposit {
  id: string;
  address: string; // адрес, на который необходимо перечислить средства отправителю
  addressQrUrl: string;
  currencyId: string; // см. /deposit-currencies/
  state: DepositState;
  transactionId: string;
}

interface DepositListing {
  items: Deposit[];
}
```
