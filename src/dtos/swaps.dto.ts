import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { CurrencyType } from '@prisma/client';

export class CreateSwapsDto {
  @IsEnum(CurrencyType)
  public sourceCurrency: string;

  @IsEnum(CurrencyType)
  public destinationCurrency: string;

  @IsNumber()
  @IsPositive()
  public amount: number;
}
