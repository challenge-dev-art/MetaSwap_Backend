import { IsNotEmpty, IsString, IsNumber, IsInt, isString } from 'class-validator';
import { CurrencyType, VerifyType, LimitType } from '@prisma/client';

export class CreateLimitDto {
  @IsString()
  @IsNotEmpty()
  public limitType: LimitType;

  @IsString()
  @IsNotEmpty()
  public checkVerification: VerifyType;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsString()
  @IsNotEmpty()
  public currencyId: CurrencyType;
}

export class UpdateLimitDto {
  @IsString()
  @IsNotEmpty()
  public limitType: LimitType;

  @IsString()
  @IsNotEmpty()
  public checkVerification: VerifyType;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsString()
  @IsNotEmpty()
  public currencyId: CurrencyType;
}