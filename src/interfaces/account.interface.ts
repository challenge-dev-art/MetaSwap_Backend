import { array } from 'zod';
import { FiatCurrency } from './currencies.interface';

export interface UserAccount {
  id: number;
  publicId: string;
  telegramUserId: string;
  telegramUsername: string | null;
  telegramPhoto: string | null;
  telegramPhotoMime: string | null;
  firstName: string;
  lastName: string | null;
  language: string | null;
  email: string | null;
  priceCurrency: string | null;
  totpSecret: string | null;
  createdAt: string;
}

export interface AllUserAccount {
  users: UserAccount[];
}
export interface Account {
  id: string; // readable user id
  telegramUsername: string | null; // не у всех пользователей Telegram определен username
  firstName: string;
  lastName: string | null;
  language: string; //  IETF BCP 47 language tag
  email: string | null;
  balance: number;
  balanceCurrencyId: string; // deprecated
  priceCurrency: FiatCurrency;
  auth2fa: boolean; // TOTP enabled (RFC 6238)
  phoneVerifid: boolean;
  nameVerified: boolean;
  addressVerified: boolean;
  createdAt: string; // date ISO 8601
}

export interface UpdateAccountLanguageRequest {
  language: string; //  IETF BCP 47 language tag
}

export interface UpdateAccountCurrencyErrorResponse {
  kind: 'UNSUPPORTED_CURRENCY_ERR';
  message: string;
}

export interface UpdateAccountLanguageErrorResponse {
  kind: 'UNSUPPORTED_LANG_CODE_ERR';
  message: string;
}

export interface UpdateAccountEmailRequest {
  email: string;
}

export interface UpdateAccountEmailErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR';
  message: string;
}

export interface RequestEmailUpdateSuccessResponse {
  kind: 'OK';
  expires: string; // date ISO 8601
}

export interface RequestEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_FORMAT_ERR' | 'SAME_EMAIL_UPDATE_ERR';
  message: string;
}

export interface ConfirmEmailUpdateErrorResponse {
  kind: 'WRONG_EMAIL_CONF_CODE_ERR';
  message: string;
}
