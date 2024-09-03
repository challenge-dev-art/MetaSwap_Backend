# Состояние верификации

Отобразить текущее состояние верификации.

**URL** : `/verification/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [Verification](/api-docs/types.md#Verification)

```typescript
interface Verification {
  status: 'VERIFIED' | 'NON_VERIFIED' | 'PENDING';
  progress: number;
  verifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  nonVerifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  verificationError: string | null;
}
```
