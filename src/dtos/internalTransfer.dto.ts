import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateInternalTransferDto {
  @IsString()
  @IsNotEmpty()
  public userTo: string;

  @IsString()
  @IsNotEmpty()
  public currencyId: string;

  @IsNumber()
  @IsPositive()
  public value: number; // сумма перевода
}
