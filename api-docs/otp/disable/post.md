# Отключить аутентификацию OTP

**URL**: `/otp/disable/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [DisableOtpRequest](/api-docs/types.md#DisableOtpRequest).

```typescript
interface DisableOtpRequest {
  passcode: string;
}
```

## Успешный ответ

**Условие**: Одноразовый пароль указан верно, аутентификация OTP включена.

**Код** : `201 CREATED`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess).

```typescript
interface ResponseSuccess {
  kind: 'OK';
}
```

## Ошибки

**Условие** : Одноразовый пароль неверен.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [DisableOtpErrorResponse](/api-docs/types.md#DisableOtpErrorResponse)

```typescript
interface DisableOtpErrorResponse {
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

**Условие** : Аутентификация OTP уже выключена.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [DisableOtpErrorResponse](/api-docs/types.md#DisableOtpErrorResponse)

```typescript
interface DisableOtpErrorResponse {
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

## Примечания

Вызов эндпоинта удаляет куки `Otp-Authorization`.
