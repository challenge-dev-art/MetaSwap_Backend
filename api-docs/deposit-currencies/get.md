# Валюты пополнения баланса

Отобразить список валют пополнения баланса.

Этот список может отличаться от /currencies/

**URL** : `/deposit-currencies/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [DepositCurrencyListing](/api-docs/types.md#DepositCurrencyListing)

```typescript
// extends CryptoCurrency
interface DepositCurrency {
  id: string;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
  lowerBound: number;
  lowerBoundUSD: number;
}

interface DepositCurrencyListing {
  items: DepositCurrency[];
}
```
