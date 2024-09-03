# Подтвердить обновление email

В случае успешного запроса будет установлен новый email.

В запросе следует указать код, который был отправлен на новый email.

**URL** : `/account/confirm-email-update/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

```typescript
interface ConfirmEmailUpdateRequest {
  code: string;
}
```

## Успешный ответ

**Условие**: код указан верно и не является устаревшим.

**Код**: `200 OK`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess).

```typescript
interface ResponseSuccess {
  kind: 'OK';
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

См. [ConfirmEmailUpdateErrorResponse](/api-docs/types.md#ConfirmEmailUpdateErrorResponse)

```typescript
interface ConfirmEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_CONF_CODE_ERR';
  message: string;
}
```

**Пример ответа**

```json
{
  "kind": "WRONG_EMAIL_CONF_CODE_ERR",
  "message": "wrong email confirmation code"
}
```
