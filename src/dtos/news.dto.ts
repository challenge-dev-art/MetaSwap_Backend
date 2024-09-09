import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;
}

export class UpdateNewsDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
  
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;
}

export class DeleteNewsDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}