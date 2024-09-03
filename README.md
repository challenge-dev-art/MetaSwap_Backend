# Metaswap

## Детали реализации

### Внутренний перевод (оффчейн-транзакция)

Перевод является внутренним, если осуществляется между зарегистрированными пользователями Metaswap.

Внутренние переводы не предполагают конвертацию средств.

Для осуществления внутреннего перевода необходимы ID отправителя и ID получателя средств, а также сумма и ID валюты.

Во время внутреннего перевода задействованы таблицы (см. src/prisma/schema.prisma):

- Asset;
- Transaction;
- InternalTransferTransaction.

Действия:

1. Проверить наличие средств на балансе пользователя (таблица Asset). Если средств недостаточно, то перевод завершить ошибкой.
2. Баланс отправителя уменьшить на сумму перевода, баланс получателя увеличить на сумму перевода.
3. Создають запись Transaction с типом INTERNAL_TRANSFER_OUTPUT. В записи сохранить ID валюты, сумма перевода, ID отправителя.
4. Создають запись Transaction с типом INTERNAL_TRANSFER_INPUT. В записи сохранить ID валюты, сумма перевода, ID получателя.
5. Создать запись InternalTransferTransaction. В записи сохранить ID валюты, сумма перевода, ссылки на на транзанзакции созданные выше, ID получателя и отправителя.

Все перечисленные выше действия осуществляются в границах одной транзакции базы данных.

## Деплой

Развертывание сервиса автоматизировано посредством PM2: https://pm2.keymetrics.io/docs/usage/deployment/

Конфигурация деплоя описана в файле ecosystem.config.js.

Проект разворачивается из репозитория Github. Для доступа к репозиторию используются ключи развертывания SSH: https://docs.github.com/ru/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys

Команды:

```sh
# Setup deployment at remote location
npx pm2 deploy development setup

# Update remote version
npx pm2 deploy development update

# Revert to -1 deployment
npx pm2 deploy development revert 1

# execute a command on remote servers
npx pm2 deploy development exec "pm2 reload all"

```

У пользователя, под которым будет осуществляться развертывание проекта, обязательно должен быть установлен bash в качестве командной оболочки по умолчанию:

```bash
sudo chsh -s /bin/bash myuser
```

## Cron

Сервис запускает задачи в фоне для синхронизации состояний.

Задачи запускаются только если определены переменные среды со значениями:

| Переменная  | Значение |
| ----------- | -------- |
| SYNC        | true     |
| INSTANCE_ID | 0        |
