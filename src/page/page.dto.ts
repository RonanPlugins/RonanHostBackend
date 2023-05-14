import { IsString } from 'class-validator';

export class PageDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsString()
  title: string;
}
