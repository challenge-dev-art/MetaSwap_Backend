import { IsNumber, IsObject, IsString } from 'class-validator';

export class CalypsoEventDto {
  @IsString()
  public requestId: string;

  @IsNumber()
  public id: number;

  @IsString()
  public createdDate: string;

  @IsString()
  public level: string;

  @IsString()
  public service: string;

  @IsString()
  public eventType: string;

  @IsObject()
  public data: object;
}
