# Создать запись в адресной книге

**URL** : `/api/accounts/`

**Метод** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [UpdateAccountLanguageRequest](/api-docs/types.md#UpdateAccountLanguageRequest)

## Успешный ответ

**Условие**: предоставленные данные действительны, пользователь аутентифицирован.

**Код** : `201 CREATED`

**Тип ответа**

См. [CreateAddressBookItemSuccessResponse](/api-docs/types.md#CreateAddressBookItemSuccessResponse)

## Ошибки

**Условие** : Указан тип `"CRYPTO"` и криптоадрес указан неверно.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateAddressBookItemErrorResponse](/api-docs/types.md#CreateAddressBookItemErrorResponse)

**Пример ответа**

```json
{
  "kind": "WRONG_CRYPTO_ADDRESS_ERR",
  "message": "неверный криптоадресс"
}
```

### Или

**Условие** : Указан тип `"INTERNAL"` и пользователь с указанным ID не найден.

**Код** : `400 BAD REQUEST`

**Тип ответа**

См. [CreateAddressBookItemErrorResponse](/api-docs/types.md#CreateAddressBookItemErrorResponse)

**Пример ответа**

```json
{
  "kind": "INTERNAL_USER_NOT_FOUND_ERR",
  "message": "пользователь не найден"
}
```
