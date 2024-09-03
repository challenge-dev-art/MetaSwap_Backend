# Обновить запись в адресной книге

**URL** : `/address-book/:id/update`

**Параметры URL**

| Наименование | Тип      | Описание                    |
| ------------ | -------- | --------------------------- |
| **id**       | `string` | ID записи в адресной книге. |

**Method** : `POST`

**Требуется авторизация** : ДА

**Тип запроса**

См. [UpdateAddressBookItemRequest](/api-docs/types.md#UpdateAddressBookItemRequest)

## Успешный ответ

**Условие**: предоставленные данные действительны, пользователь аутентифицирован.

**Код** : `200 CREATED`

**Тип ответа**

См. [ResponseSuccess](/api-docs/types.md#ResponseSuccess)

## Ошибки

**Условие** : Тип указанный в запросе не соответвует типу записи (`'CRYPTO'|'FIAT'`)

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [UpdateAddressBookItemErrorResponse](/api-docs/types.md#UpdateAddressBookItemErrorResponse)

**Пример ответа**

```json
{
  "kind": "BOOK_ITEM_TYPE_MISMATCH_ERR",
  "message": "измение типа записи не поддерживается"
}
```

### Или

**Условие** : Указан тип `"CRYPTO"` и криптоадрес указан неверно.

**Code** : `400 BAD REQUEST`

**Тип ответа**

См. [UpdateAddressBookItemErrorResponse](/api-docs/types.md#UpdateAddressBookItemErrorResponse)

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

См. [UpdateAddressBookItemErrorResponse](/api-docs/types.md#UpdateAddressBookItemErrorResponse)

**Пример ответа**

```json
{
  "kind": "INTERNAL_USER_NOT_FOUND_ERR",
  "message": "пользователь не найден"
}
```

### Или

**Условие** : Запись в адресной книге не найдена.

**Код** : `404 NOT FOUND`

**Пример ответа** : `{"message":"not found"}`

## Примечания

Тип записи не может быть изменен.
