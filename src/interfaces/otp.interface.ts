export interface Otp {
  enabled: boolean;
}

export interface OtpSecret {
  secret: string;
  url: string;
  qrUrl: string;
}

export interface OtpAuthSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}

export interface EnableOtpSuccessResponse {
  kind: 'OK';
  session: string; // следует отправлять в заголовке X-Otp-Auth-Token
}

export interface EnableOtpErrorResponse {
  kind: 'WRONG_OTP_PASSCODE_ERR' | 'DISABLED_OTP_REQUIRED_ERR';
  message: string;
}
