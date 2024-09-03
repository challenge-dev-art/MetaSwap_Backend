export interface ResponseSuccess {
  kind: 'OK';
}

export interface CryptoAddress {
  type: 'CRYPTO';
  address: string;
  chain: string;
}

export interface AuthOtpRequiredErrorResponse {
  kind: 'AUTH_OTP_REQUIRED_ERR';
  message: string;
}
