import { CurrencyType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateDepositDto {
  @IsEnum(CurrencyType)
  public currencyId: CurrencyType;
}
