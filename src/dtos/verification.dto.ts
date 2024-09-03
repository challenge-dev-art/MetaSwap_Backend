import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  public docId: string;

  // файлы обрабатываются посредством multer
}
