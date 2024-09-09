import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
import { Permission, Role } from '@prisma/client';

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

export class UpdateUserPermissionDto {
  @IsInt()
  @IsNotEmpty()
  public userId: number;

  @IsString()
  @IsNotEmpty()
  public permission: Permission;
}

export class AddAdminDto {
  @IsInt()
  @IsNotEmpty()
  public userId: number;
}
