# Создать запрос на измение email

Создать запрос подтверждения обновления email и отправить код запроса на новый email.

Также еще одно письмо будет отправлено на текущий email, если таковой есть. В нем будет уведомление о попытке смены email.

**URL** : `/account/request-email-update/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

```typescript
interface RequestEmailUpdateRequest {
  email: string;
}
```

## Успешный ответ

**Условие**: email указан верно и отличается от текущего email.

**Код**: `200 OK`

**Тип ответа**

См. [RequestEmailUpdateSuccessResponse](/api-docs/types.md#RequestEmailUpdateSuccessResponse).

```typescript
interface RequestEmailUpdateSuccessResponse {
  kind: 'OK';
  expires: string; // date ISO 8601
}
```

**Пример ответа**

```json
{
  "message": "OK"
}
```

## Ошибки

**Условие**: email указан неверно.

**Код**: `400 BAD REQUEST`

**Тип ответа**

См. [RequestEmailUpdateErrorResponse](/api-docs/types.md#RequestEmailUpdateErrorResponse).

```typescript
interface RequestEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR' | 'SAME_EMAIL_UPDATE_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "WRONG_EMAIL_FORMAT_ERR",
  "message": "wrong email format"
}
```

### Или

**Условие**: указан текущий email.

**Код**: `400 BAD REQUEST`

**Тип ответа**

См. [RequestEmailUpdateErrorResponse](/api-docs/types.md#RequestEmailUpdateErrorResponse).

```typescript
interface RequestEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR' | 'SAME_EMAIL_UPDATE_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "SAME_EMAIL_UPDATE_ERR",
  "message": "same email is specified for update"
}
```
