import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { CurrencyType } from '@prisma/client';

export class CreateSwapsDto {
  @IsEnum(CurrencyType)
  public currencyFromId: string;

  @IsEnum(CurrencyType)
  public currencyToId: string;

  @IsNumber()
  @IsPositive()
  public value: number;
}
