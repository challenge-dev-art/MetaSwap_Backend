import { IsNotEmpty, IsString } from 'class-validator';

export class EnableOtpRequestDto {
  @IsString()
  @IsNotEmpty()
  public secret: string;

  @IsString()
  @IsNotEmpty()
  public passcode: string;
}

export class DisableOtpRequestDto {
  @IsString()
  @IsNotEmpty()
  public passcode: string;
}

export class OtpAuthRequestDto {
  @IsString()
  @IsNotEmpty()
  public passcode: string;
}
