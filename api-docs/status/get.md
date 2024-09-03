# Отобразить текущий статус сервера

Конечная точка используется для проверки сервиса на работоспособность. Если сервис доступен, то возвращает ответ `{"message":"OK"}`

**URL** : `/status`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
  "message": "OK"
}
```
