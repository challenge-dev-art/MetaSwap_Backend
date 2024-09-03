import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAutoconvertRequestDto {
  @IsString()
  @IsNotEmpty()
  public currencyIdFrom: string;

  @IsString()
  @IsNotEmpty()
  public currencyIdTo: string;
}
