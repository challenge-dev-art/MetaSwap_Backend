# Типы API

## Аккаунт текущего пользователя

### Account

Текущий пользователь.

```typescript
interface Account {
  id: string; // readable user id
  telegramUsername: string | null; // не у всех пользователей Telegram определен username
  firstName: string;
  lastName: string | null;
  language: string; //  IETF BCP 47 language tag
  email: string | null;
  balance: string;
  balanceCurrencyId: string;
  auth2fa: boolean; // TOTP enabled (RFC 6238)
  phoneVerifid: boolean;
  nameVerified: boolean;
  addressVerified: boolean;
  createdAt: string; // date ISO 8601
}
```

### UpdateAccountLanguageRequest

Изменить язык пользователя.

```typescript
interface UpdateAccountLanguageRequest {
  language: string; //  IETF BCP 47 language tag
}
```

### UpdateAccountLanguageErrorResponse

```typescript
interface UpdateAccountLanguageErrorResponse {
  kind: 'UNSUPPORTED_LANG_CODE_ERR';
  message: string;
}
```

### UpdateAccountCurrencyRequest

```typescript
interface UpdateAccountCurrencyRequest {
  currencyId: string; // см. /price-currencies/
}
```

### UpdateAccountCurrencyErrorResponse

```typescript
interface UpdateAccountCurrencyErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

### UpdateAccountEmailRequest

```typescript
interface UpdateAccountEmailRequest {
  email: string;
}
```

### UpdateAccountEmailErrorResponse

```typescript
interface UpdateAccountEmailErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR';
  message: string;
}
```

### RequestEmailUpdateSuccessResponse

```typescript
interface RequestEmailUpdateSuccessResponse {
  kind: 'OK';
  expires: string; // date ISO 8601
}
```

### RequestEmailUpdateErrorResponse

```typescript
interface RequestEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR' | 'SAME_EMAIL_UPDATE_ERR';
  message: string;
}
```

### ConfirmEmailUpdateRequest

```typescript
interface ConfirmEmailUpdateRequest {
  code: string;
}
```

### ConfirmEmailUpdateErrorResponse

```typescript
interface ConfirmEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_CONF_CODE_ERR';
  message: string;
}
```

## Одноразовый пароль входа (2FA)

### Otp

```typescript
interface Otp {
  enabled: boolean;
}
```

### OtpAuthRequest

```typescript
interface OtpAuthRequest {
  passcode: string;
}
```

### OtpAuthSuccessResponse

```typescript
interface OtpAuthSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}
```

### OtpAuthErrorResponse

```typescript
interface OtpAuthErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'ENABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

### OtpSecret

```typescript
interface OtpSecret {
  secret: string;
  url: string;
  qrUrl: string;
}
```

### EnableOtpRequest

```typescript
interface EnableOtpRequest {
  secret: string; // см. /otp/create-secret
  passcode: string;
}
```

### EnableOtpSuccessResponse

```typescript
interface EnableOtpSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}
```

### EnableOtpErrorResponse

```typescript
interface EnableOtpErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'DISABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

### DisableOtpRequest

```typescript
interface DisableOtpRequest {
  passcode: string;
}
```

### DisableOtpErrorResponse

```typescript
interface DisableOtpErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'ENABLED_OTP_REQUIRED_ERR';
  message: string;
}
```

## Активы

### CryptoAsset

```typescript
interface CryptoAsset {
  id: string;
  type: 'CRYPTO';
  currencyId: string;
  currency: Currency;
  value: number;
  price: number;
  priceCurrency: FiatCurrency;
}
```

### FiatAsset

```typescript
interface FiatAsset {
  id: string;
  type: 'FIAT';
  currencyId: string;
  currency: Currency;
  value: number;
}
```

### Asset

```typescript
type Asset = CryptoAsset | FiatAsset;
```

### AssetListing

```typescript
interface AssetListing {
  items: Asset[];
}
```

## Транзакции

### DepositTransaction

```typescript
interface DepositTransaction {
  id: string;
  type: 'DEPOSIT';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  depositState: DepositState;
  currencyId: string;
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}
```

### PayoutTransaction

```typescript
interface PayoutTransaction {
  id: string;
  type: 'PAYOUT';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  payoutState: PayoutState;
  currencyId: string;
  currency: Currency;
  value: number;
  depositAddress: string;
  createdAt: string; // date ISO 8601
}
```

### SwapTransaction

```typescript
interface SwapTransaction {
  id: string;
  type: 'SWAP';
  status: 'PENDING' | 'SUCCEED' | 'FAILED';
  currencyIdFrom: string;
  currencyIdTo: string;
  valueIn: number;
  valueOut: number;
  fee: number;
  createdAt: string; // date ISO 8601
}
```

### InternalTransferOutputTransaction

```typescript
interface InternalTransferOutputTransaction {
  id: string;
  type: 'INTERNAL_TRANSFER_OUTPUT';
  userFrom: string;
  userTo: string;
  currencyId: string; // deprecated
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}
```

### InternalTransferInputTransaction

```typescript
interface InternalTransferInputTransaction {
  id: string;
  type: 'INTERNAL_TRANSFER_INPUT';
  userFrom: string;
  userTo: string;
  currencyId: string; // deprecated
  currency: Currency;
  value: number;
  createdAt: string; // date ISO 8601
}
```

### Transaction

```typescript
type Transaction = DepositTransaction | PayoutTransaction | SwapTransaction | InternalTransferOutputTransaction | InternalTransferInputTransaction;
```

### TransactionListing

```typescript
interface TransactionListing {
  items: Transaction[];
  nextToken: string | null;
}
```

## Внутренние переводы (оффчейн-транзакции)

### CreateInternalTransferRequest

```typescript
interface CreateInternalTransferRequest {
  userTo: string; // получатель средств; cм. /account
  currencyId: string; // см. /currencies
  value: number; // сумма перевода; например, 1.53 BTC
}
```

### CreateInternalTransferResponse

```typescript
interface CreateInternalTransferSuccessResponse {
  kind: 'OK';
  transactionId: string; // см. /transactions
}
```

### CreateInternalTransferErrorResponse

```typescript
interface CreateInternalTransferErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

## Пополнение

### DepositState

```typescript
// См. https://docs.calypso.finance/reference/enum-description#invoice-state
export type DepositState =
  | 'PENDING_PAYMENT' // Не оплачено
  | 'MEM_POOL_FOUND' // Не оплачено
  | 'PAID' // Оплачено
  | 'PENDING_INTERVENTION' // На рассмотрении
  | 'COMPLETED' // Оплачено
  | 'CANCEL' // Отменено
  | 'ARCHIVED' // Архивировано
  | 'DECLINED' // Заблокированно
  | 'PENDING_COMPLIANCE_CHECK' // На проверке
  | 'EXPIRED'; // Истек
```

type DepositState =

| 'CANCEL'
| 'ARCHIVED'
| 'DECLINED'
| 'PENDING_COMPLIANCE_CHECK'
| 'EXPIRED';

### Deposit

```typescript
interface Deposit {
  id: string;
  address: string; // адрес, на который необходимо перечислить средства отправителю
  addressQrUrl: string;
  currencyId: string; // см. /deposit-currencies/
  state: DepositState;
  transactionId: string;
}
```

### DepositListing

```typescript
interface DepositListing {
  items: Deposit[];
}
```

### DepositCurrency

```typescript
// extends CryptoCurrency
interface DepositCurrency {
  id: string;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
  lowerBound: number;
  lowerBoundUSD: number;
}
```

### DepositCurrencyListing

```typescript
interface DepositCurrencyListing {
  items: DepositCurrency[];
}
```

## Вывод

### PayoutState

```typescript
// См. https://docs.calypso.finance/reference/enum-description#payout-state
type PayoutState =
  | 'CREATION_IN_PROGRESS' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'PENDING_CONFIRMATION' // НЕ ИСПОЛЬЗУЕТСЯ
  | 'CONFIRMED' // Создано
  | 'IN_PROGRESS' // В ожидании
  | 'COMPLETED' // Завершено
  | 'FAILED' // Ошибка
  | 'CANCELED'; // Отменено
```

### Payout

```typescript
interface Payout {
  id: string;
  depositAddress: string; // адрес, на который необходимо перечислить средства отправителю
  amount: number;
  currencyId: string; // см. /payout-currencies/
  comment: string;
  state: PayoutState;
  transactionId: string;
}
```

### PayoutListing

```typescript
interface PayoutListing {
  items: Payout[];
}
```

### CreatePayoutRequest

```typescript
interface CreatePayoutRequest {
  depositAddress: string;
  comment: string; // не более чем 200 символов
  currencyId: string; // см. /payout-currencies/
  value: number;
}
```

### CreatePayoutErrorResponse

```typescript
interface CreatePayoutErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'WRONG_CRYPTO_ADDRESS_ERR';
  message: string;
}
```

## Swap

### SwapRate

```typescript
interface SwapRate {
  id: string;
  currencyFrom: CryptoCurrency; // см. /swap-currencies/
  currencyTo: CryptoCurrency; // см. /swap-currencies/
  rate: number;
}
```

### SwapRateListing

```typescript
interface SwapRateListing {
  items: SwapRate[];
}
```

### Swap

```typescript
interface Swap {
  id: string;
  currencyFrom: CryptoCurrency; // см. /swap-currencies/
  currencyTo: CryptoCurrency; // см. /swap-currencies/
  fee: number;
  feeCurrency: CryptoCurrency; // см. /swap-currencies/
}
```

### SwapListing

```typescript
interface SwapListing {
  items: Swap[];
}
```

### CreateSwapRequest

```typescript
interface CreateSwapRequest {
  currencyFromId: string;
  currencyToId: string;
  value: number;
}
```

### CreateSwapErrorResponse

```typescript
interface CreateSwapErrorResponse {
  kind: 'INSUFFICIENT_FUNDS_ERR' | 'UNSUPPORTED_CURRENCY_ERR' | 'SWAP_DIRECTION_NOT_FOUND_ERR';
  message: string;
}
```

## Верификация

### Verification

```typescript
interface Verification {
  status: 'VERIFIED' | 'NON_VERIFIED' | 'PENDING';
  progress: number;
  verifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  nonVerifiedLimits: {
    kind: 'TRANSFER_MONTH' | 'SWAP_MONTH' | 'AUTOCONVERT_MONTH';
    value: number;
    currencyName: string;
  }[];
  verificationError: string | null;
}
```

## Прочее

### LanguageListing

Список языков.

```typescript
interface LanguageListing {
  items: {
    code: string; // IETF BCP 47 language tag
  }[];
}
```

### AuthOtpRequiredErrorResponse

```typescript
interface AuthOtpRequiredErrorResponse {
  kind: 'AUTH_OTP_REQUIRED_ERR';
  message: string;
}
```

## Общие типы

### ResponseSuccess

```typescript
interface ResponseSuccess {
  kind: 'OK';
}
```

### CryptoAddress

```typescript
interface CryptoAddress {
  type: 'CRYPTO';
  address: string;
  chain: string;
}
```

### CryptoCurrency

```typescript
interface CryptoCurrency {
  id: string;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
}
```

### FiatCurrency

```typescript
interface FiatCurrency {
  id: string;
  type: 'FIAT';
  code: string;
  name: string;
  symbol: string;
  flagUrl: string;
  decimals: number;
}
```

### Currency

```typescript
type Currency = CryptoCurrency | FiatCurrency;
```

### CurrencyListing

```typescript
interface CurrencyListing {
  items: Currency[];
}
```

### CryptoCurrencyListing

```typescript
interface CryptoCurrencyListing {
  items: CryptoCurrency[];
}
```

### FiatCurrencyListing

```typescript
interface FiatCurrencyListing {
  items: FiatCurrency[];
}
```

## Адреса с автоконвертацией

### Autoconvert

```typescript
interface Autoconvert {
  id: string;
  address: string;
  addressQrUrl: string;
  currencyFrom: CryptoCurrency; // см. /autoconvert-currencies/
  currencyTo: CryptoCurrency; // см. /autoconvert-currencies/
}
```

### AutoconvertListing

```typescript
interface AutoconvertListing {
  items: Autoconvert[];
}
```

### CreateAutoconvertRequest

```typescript
interface CreateAutoconvertRequest {
  currencyIdFrom: string; // см. /autoconvert-currencies/
  currencyIdTo: string; // см. /autoconvert-currencies/
}
```

### CreateAutoconvertErrorResponse

```typescript
interface CreateAutoconvertErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}
```

## Адресная книга

### AddressBookItem

```typescript
interface CryptoAdressBookItem {
  id: string;
  type: 'CRYPTO';
  name: string;
  note: string;
  address: CryptoAddress;
  createdAt: string;
}

interface InternalAddressBookItem {
  id: string;
  type: 'INTERNAL';
  name: string;
  note: string;
  internalUserId: string;
  createdAt: string;
}

type AddressBookItem = CryptoAdressBookItem | InternalAddressBookItem;
```

### AddressBook

```typescript
interface AddressBook {
  items: AddressBookItem[];
}
```

### CreateAddressBookItemRequest

```typescript
interface CreateCryptoAddressBookItemRequest {
  type: 'CRYPTO';
  name: string;
  note: string;
  address: CryptoAddress;
}

interface CreateInternalAddressBookItemRequest {
  type: 'INTERNAL';
  name: string;
  note: string;
  internalUserId: string;
}

type CreateAddressBookItemRequest = CreateCryptoAddressBookItemRequest | CreateInternalAddressBookItemRequest;
```

### CreateAddressBookItemSuccessResponse

```typescript
interface CreateAddressBookItemSuccessResponse {
  kind: 'OK';
  addressBookItemId: string;
  message: string;
}
```

### CreateAddressBookItemErrorResponse

```typescript
interface CreateAddressBookItemErrorResponse {
  kind: 'WRONG_CRYPTO_ADDRESS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR';
  message: string;
}
```

### UpdateAddressBookItemRequest

```typescript
interface UpdateCryptoAddressBookItemRequest {
  type: 'CRYPTO';
  name?: string;
  note?: string;
  address?: CryptoAddress;
}

interface UpdateInternalAddressBookItemRequest {
  type: 'INTERNAL';
  name?: string;
  note?: string;
  internalUserId?: string;
}
type UpdateAddressBookItemRequest = UpdateCryptoAddressBookItemRequest | UpdateInternalAddressBookItemRequest;
```

### UpdateAddressBookItemErrorResponse

```typescript
interface UpdateAddressBookItemErrorResponse {
  kind: 'WRONG_CRYPTO_ADDRESS_ERR' | 'INTERNAL_USER_NOT_FOUND_ERR' | 'BOOK_ITEM_TYPE_MISMATCH_ERR';
  message: string;
}
```

## Коды ошибок

| Код                              | Описание                                              |
| -------------------------------- | ----------------------------------------------------- |
| **UNSUPPORTED_LANG_CODE_ERR**    | Код языка не поддерживается.                          |
| **UNSUPPORTED_CURRENCY_ERR**     | Валюта не поддерживается.                             |
| **WRONG_EMAIL_FORMAT_ERR**       | Неверный формат e-mail.                               |
| **WRONG_CRYPTO_ADDRESS_ERR**     | Неверный криптоадрес.                                 |
| **INTERNAL_USER_NOT_FOUND_ERR**  | Пользователь не найден.                               |
| **BOOK_ITEM_TYPE_MISMATCH_ERR**  | Измение типа записи не поддерживается.                |
| **INSUFFICIENT_FUNDS_ERR**       | Недостаточно средств.                                 |
| **SWAP_DIRECTION_NOT_FOUND_ERR** | направление обмена не найдено.                        |
| **AUTH_OTP_REQUIRED_ERR**        | Требуется вход посредством второго фактора OTP.       |
| **WRONG_OTP_PASSCODE_ERR**       | Неверный одноразовый пароль.                          |
| **ENABLED_OTP_REQUIRED_ERR**     | Для совершения операции необходим включенный OTP.     |
| **DISABLED_OTP_REQUIRED_ERR**    | Для совершения операции необходим отключенный OTP.    |
| **SAME_EMAIL_UPDATE_ERR**        | В запросе для обновления текущий email.               |
| **WRONG_EMAIL_CONF_CODE_ERR**    | Код установки/подтверждения смены email указан верно. |
