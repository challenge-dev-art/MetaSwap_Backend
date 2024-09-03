# Обновить данные верификации

**URL**: `/verification/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Запрос**

| Поле             | Описание              |
| ---------------- | --------------------- |
| firstName        | Имя                   |
| lastName         | Фамилия               |
| docId            | Номер паспорта или ID |
| photoDoc         | Фото документа        |
| photoUserWithDoc | Фото c документом     |

Требования к фото: PNG, JPEG, или TIFF, размер не должен привышать 10MiB.

MIME-тип содержимого: **multipart/form-data**.

## Успешный ответ

**Условие**: данные указаны верно.

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
