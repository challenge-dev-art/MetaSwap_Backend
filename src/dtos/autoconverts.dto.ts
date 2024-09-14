import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAutoconvertRequestDto {
  @IsString()
  @IsNotEmpty()
  public currencyIdFrom: string;

  @IsString()
  @IsNotEmpty()
  public currencyIdTo: string;

  @IsString()
  @IsNotEmpty()
  public address: string;
}

export class ExecuteAutoconvertRequestDto {
  @IsNumber()
  @IsNotEmpty()
  public autoconvertId: number;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;
}