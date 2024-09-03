import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountCurrencyDto {
  @IsString()
  @IsNotEmpty()
  public currencyId: string;
}

export class UpdateAccountLanguageDto {
  @IsString()
  @IsNotEmpty()
  public language: string;
}

export class UpdateAccountEmailDto {
  @IsString()
  @IsNotEmpty()
  public email: string;
}

export class RequestEmailUpdateRequestDto {
  @IsString()
  @IsNotEmpty()
  public email: string;
}

export class ConfirmEmailUpdateRequestDto {
  @IsString()
  @IsNotEmpty()
  public code: string;
}
