# Изменить e-mail текущего пользователя

**URL** : `/account/update-language/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [UpdateAccountEmailRequest](/api-docs/types.md#UpdateAccountEmailRequest)

```typescript
interface UpdateAccountEmailRequest {
  email: string;
}
```

**Пример запроса**

```json
{
  "email": "login@example.com"
}
```

## Успешный ответ

**Условие**: предоставленные данные действительны, пользователь аутентифицирован.

**Код**: `200 OK`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess)

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

**Условие**: предоставленные данные недействительны, пользователь не аутентифицирован.

**Код**: `400 BAD REQUEST`

**Тип ответа**

См. [UpdateAccountEmailErrorResponse](/api-docs/types.md#UpdateAccountEmailErrorResponse)

```typescript
interface UpdateAccountEmailErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR';
  message: string;
}
```

**Коды ошибок**

| Код                        | Описание                |
| -------------------------- | ----------------------- |
| **WRONG_EMAIL_FORMAT_ERR** | Неверный формат e-mail. |
