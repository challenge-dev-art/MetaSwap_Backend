import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
import { FeeType } from '@prisma/client';

export class CreateFeeDto {
  @IsString()
  @IsNotEmpty()
  public type: FeeType;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;
}

export class GetFeeDto {
  @IsString()
  @IsNotEmpty()
  public type: FeeType;
}