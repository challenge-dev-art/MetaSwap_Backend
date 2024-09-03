# Список пополнений

Отобразить список исходящих платежей.

**URL** : `/payouts/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [PayoutListing](/api-docs/types.md#PayoutListing)

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
  state: PayoutState;
  transactionId: string;
}

interface PayoutListing {
  items: Payout[];
}
```
