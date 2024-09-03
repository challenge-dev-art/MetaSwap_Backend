# Завершить сессию OTP

Удалить

**URL**: `/otp/logout/`

**Метод** : `POST`

**Требуется авторизация** : НЕТ

**Запрос** : НЕТ

## Успешный ответ

**Условие**: НЕТ.

**Код** : `200 CREATED`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess).

```typescript
interface ResponseSuccess {
  kind: 'OK';
}
```

## Примечания

Вызов эндпоинта удаляет куки `Otp-Authorization` для хранения сессии.
