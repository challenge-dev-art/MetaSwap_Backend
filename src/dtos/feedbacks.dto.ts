import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;
}

export class DeleteFeedbackDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}