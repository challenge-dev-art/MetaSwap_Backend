import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePayoutDto {
  @IsString()
  @MaxLength(200)
  public depositAddress: string;

  @IsString()
  @IsNotEmpty()
  public currencyId: string;

  @IsString()
  @MaxLength(200)
  public comment: string;

  @IsNumber()
  @IsPositive()
  public value: number;
}
