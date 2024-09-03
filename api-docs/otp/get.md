# Состояние аутентификации OTP

**URL** : `/otp/`

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [Otp](/api-docs/types.md#Otp).

```typescript
interface Otp {
  enabled: boolean;
}
```
