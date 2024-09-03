# Список языков

Отобразить список поддерживаемых языков.

**URL** : `/languages/`

**Метод** : `GET`

**Требуется авторизация** : НЕТ

## Успешный ответ

**Код** : `200 OK`

**Тип ответа**

См. [LanguageListing](/api-docs/types.md#LanguageListing)

```typescript
interface LanguageListing {
  items: {
    code: string; // IETF BCP 47 language tag
  }[];
}
```
