# Изменить язык текущего пользователя

**URL** : `/account/update-language/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [UpdateAccountLanguageRequest](/api-docs/types.md#UpdateAccountLanguageRequest)

```typescript
interface UpdateAccountLanguageRequest {
  language: string; //  IETF BCP 47 language tag
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

См. [UpdateAccountLanguageErrorResponse](/api-docs/types.md#UpdateAccountLanguageErrorResponse)

```typescript
interface UpdateAccountLanguageErrorResponse {
  kind: 'UNSUPPORTED_LANG_CODE_ERR';
  message: string;
}
```

**Коды ошибок**

| Код                           | Описание                     |
| ----------------------------- | ---------------------------- |
| **UNSUPPORTED_LANG_CODE_ERR** | Код языка не поддерживается. |

## Примечания

Список поддерживаемых языков доступен посредством вызова [`GET /languages/`](/api-docs/languages/get.md)
