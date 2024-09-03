# Включить аутентификацию OTP

**URL**: `/otp/enable/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [EnableOtpRequest](/api-docs/types.md#EnableOtpRequest).

```typescript
interface EnableOtpRequest {
  secret: string; // см. /otp/create-secret
  passcode: string;
}
```

## Успешный ответ

**Условие**: Одноразовый пароль соответствует секрету, аутентификация OTP отключена.

**Код** : `201 CREATED`

**Тип ответа**

См. [EnableOtpSuccessResponse](/api-docs/types.md#EnableOtpSuccessResponse).

```typescript
interface EnableOtpSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}
```

## Ошибки

**Условие** : Одноразовый пароль неверен.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [EnableOtpErrorResponse](/api-docs/types.md#EnableOtpErrorResponse)

```typescript
interface EnableOtpErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'DISABLED_OTP_REQUIRED_ERR';
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

**Условие** : Аутентификация OTP уже включена.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [EnableOtpErrorResponse](/api-docs/types.md#EnableOtpErrorResponse)

```typescript
interface EnableOtpErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'DISABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "DISABLED_OTP_REQUIRED_ERR",
  "message": "disabled otp required"
}
```
