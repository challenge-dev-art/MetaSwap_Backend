import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateDocumentsDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;
}

export class UpdateDocumentsDto {
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

export class DeleteDocumentsDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}