# Metaswap API

## Открытые конечные точки

Открытые конечные точки не требуют аутентификации.

- [Status](status/get.md): `GET /status/`

## Примечания

Шаблон документации: https://github.com/jamescooke/restapidocs/tree/master

## Конечные точки, требующие аутентификации

Аутентификация пользователей реализована посредством заголовка HTTP `X-Auth-Token`. Заголовок `X-Auth-Token` должен быть включен в каждый запрос.

Ожидаемое значение заголовка: значение initData объекта [Telegram.WebApp](https://core.telegram.org/bots/webapps).

В режиме development также вместо значения initData может быть использована строка соответствующая шаблону `tg:%d`, где %d соответствует ID пользователя Telegram (см. [@my_id_bot](https://t.me/my_id_bot)). В этом случае запрос будет осуществляться от имени пользователя.

Если у пользователя включен допополнительный фактор аутентификации, то также необходимо включать в каждый запрос заголовок `X-Otp-Auth-Token`.

Ожидаемое значение заголовка: токен сессии, полученный посредством вызовов `/otp/enable/` или `/otp/auth/`

Вход по OTP является необязательным дополнительным фактором аутентификации.

Если вход посредством OTP включен и пользователь не аутентифицирован посредством второго фактора, то вызовы API завершаются ошибкой [AuthOtpRequiredErrorResponse](/api-docs/types.md#AuthOtpRequiredErrorResponse).

- Аккаунт текущего пользователя
  - [Текущий пользователь](account/get.md): `GET /account/`
  - [Изменить язык пользователя](account/update-language/post.md): `POST /account/update-language/`
  - [Изменить e-mail пользователя](account/update-email/post.md): `POST /account/update-email/`
  - [Изменить валюту баланса](account/update-currency/post.md): `POST /account/update-currency/`
  - [Создать запрос на измение email](account/request-email-update/post.md): `POST /account/request-email-update/`
  - [Подтвердить обновление email](account/confirm-email-update/post.md): `POST /account/confirm-email-update/`
- Одноразовый пароль входа (2FA)
  - [Состояние аутентификации OTP](otp/get.md): `GET /otp/`
  - [Создать секретный ключ аутентификации](otp/create-secret/post.md): `POST /otp/create-secret/`
  - [Включить аутентификацию OTP](otp/enable/post.md): `POST /otp/enable/`
  - [Отключить аутентификацию OTP](otp/disable/post.md): `POST /otp/disable/`
  - [Аутентифицироваться посредством OTP](otp/auth/post.md): `POST /otp/auth/`
- Активы
  - [Список валютных активов](assets/get.md): `POST /assets/`
- Транзакции
  - [История транзакций](transactions/get.md): `GET /transactions/`
- Внутренние переводы (оффчейн-транзакции)
  - [Создать внутренний перевод](internal-transfers/post.md): `POST /internal-transfers/`
- Пополнение
  - [Валюты пополнения баланса](deposit-currencies/get.md): `POST /deposit-currencies/`
  - [Список пополнений](deposits/get.md): `GET /deposits/`
  - [Пополнить баланс](deposits/post.md): `POST /deposits/`
- Вывод
  - [Валюты исходящих платежей](payout-currencies/get.md): `GET /payout-currencies/`
  - [Список исходящих платежей](payouts/get.md): `GET /payouts/`
  - [Вывести средства](payouts/post.md): `POST /payouts/`
- Адреса с автоконвертацией
  - [Список адресов с автоконвертацией](autoconverts/get.md): `GET /autoconverts/`
  - [Создать адрес с автоконвертацией](autoconverts/post.md): `POST /autoconverts/`
- SWAP
  - [Валюты SWAP](swap-currencies/get.md): `GET /swap-currencies/`
  - [Курсы валют SWAP](swap-rates/get.md): `GET /swap-rates/`
  - [Список запросов на обмен](swaps/get.md): `GET /swaps/`
  - [Создать запрос на обмен](swaps/post.md): `POST /swaps/`
- Верификация
  - [Состояние верификации](verification/get.md): `GET /verification/`
  - [Обновить данные верификации](verification/post.md): `POST /verification/`
- Прочее
  - [Список языков](languages/get.md): `GET /languages/`
  - [Список валют](currencies/get.md): `GET /currencies/`
  - [Валюты стоимости активов](price-currencies/get.md): `GET /price-currencies/`

## Статические файлы

### Значки блокчейнов и токенов

URL значков блокчейнов: `/static/chain-icons/{CHAIN}.svg`, где {CHAIN} -- код блокчейна.

URL значков криптовалют: `/static/token-icons/{TOKEN}.svg`, где {TOKEN} -- код криптовалюты.

Эндпоинт для загрузки кодов криптовалют и блокчейнов: [`GET /currencies/`](currencies/get.md).

Примеры URL:

- https://metaswap.goldbranch.dev/api/v1/static/chain-icons/TRON.svg
- https://metaswap.goldbranch.dev/api/v1/static/token-icons/BTC.svg
