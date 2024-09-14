import { Update } from '@grammyjs/types';
import { VerifyType, LimitType, CurrencyType } from '@prisma/client';

export interface LimitRequest {
  checkVerification: VerifyType;
  limitType: LimitType;
  currencyId: CurrencyType;
  amount:  number;
}

export interface UpdateLimitRequest {
  id: number;
  checkVerification: VerifyType;
  limitType: LimitType;
  currencyId: CurrencyType;
  amount:  number;
}