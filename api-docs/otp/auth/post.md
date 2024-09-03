# Аутентифицироваться посредством OTP

**URL**: `/otp/auth/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [OtpAuthRequest](/api-docs/types.md#OtpAuthRequest).

```typescript
interface OtpAuthRequest {
  passcode: string;
}
```

## Успешный ответ

**Условие**: Одноразовый пароль указан верно, аутентификация OTP включена.

**Код** : `200 CREATED`

**Тип ответа**

См. [OtpAuthSuccessResponse](/api-docs/types.md#OtpAuthSuccessResponse).

```typescript
interface OtpAuthSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}
```

## Ошибки

**Условие** : Одноразовый пароль неверен.

**Code** : `401 UNAUTHORIZED`

**Тип ответа**

См. [OtpAuthErrorResponse](/api-docs/types.md#OtpAuthErrorResponse).

```typescript
interface OtpAuthErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'ENABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "WRONG_OTP_PASSCODE_ERR",
  "message": "wrong passcode"
}
```

### Или

**Условие** : Аутентификация OTP выключена.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [OtpAuthErrorResponse](/api-docs/types.md#OtpAuthErrorResponse).

```typescript
interface OtpAuthErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'ENABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "ENABLED_OTP_REQUIRED_ERR",
  "message": "enabled otp required"
}
```

См. [OtpAuthErrorResponse](/api-docs/types.md#OtpAuthErrorResponse).

```typescript
interface OtpAuthErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'ENABLED_OTP_REQUIRED_ERR';
}
```
