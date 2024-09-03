# Создать секретный ключ аутентификации

Ответ содержит URL QR-кода и секретный ключ аутентификации.

QR-код используется пользователями для сканирования приложением Google Authenticator или другим подобным приложением.

Секретный ключ используется в вызове /otp/enable.

**URL**: `/otp/create-secret/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Запрос**: НЕТ

## Успешный ответ

**Условие**: НЕТ

**Код** : `200 CREATED`

**Тип ответа**

См. [OtpSecret](/api-docs/types.md#OtpSecret).

```typescript
interface OtpSecret {
  secret: string;
  url: string;
  qrUrl: string;
}
```
