# История транзакций

**URL** : `/transactions/`

**Параметры запроса**

| Наименование     | Обязательный | Тип                   | Описание                                                            |
| ---------------- | ------------ | --------------------- | ------------------------------------------------------------------- |
| **type**         | Нет          | `Transaction["type"]` | Тип транзакции (см. [Transaction](/api-docs/types.md#Transaction)). |
| **crypto-token** | Нет          | `string`              | Токен криптовалюты (см. [Currency](/api-docs/types.md#Currency)).   |
| **crypto-chain** | Нет          | `string`              | Код блокчейна (см. [Currency](/api-docs/types.md#Currency)).        |
| **category**     | Нет          | `string`              | Категории транзакции (см. [Примечания](#примечания))                |

Для того, чтобы в запросе указать несколько категорий сразу, коды категорий необходимо перечислить через запятую.

Пример: `GET /transactions?category=TRANSFER,EXCHANGE`.

**Метод** : `GET`

**Требуется авторизация** : ДА

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [TransactionListing](/api-docs/types.md#TransactionListing)

## Примечания

**Категории транзакций**

| Код       | Описание  | Типы транзакций                                   |
| --------- | --------- | ------------------------------------------------- |
| TRANSFER  | Переводы  | INTERNAL_TRANSFER_OUTPUT, INTERNAL_TRANSFER_INPUT |
| EXCHANGE  | Обмен     |                                                   |
| OFFCHAIN  | Offchain  | INTERNAL_TRANSFER_OUTPUT, INTERNAL_TRANSFER_INPUT |
| INCOMING  | Входящие  | INTERNAL_TRANSFER_INPUT                           |
| OUTCOMING | Исходящие | INTERNAL_TRANSFER_OUTPUT                          |
