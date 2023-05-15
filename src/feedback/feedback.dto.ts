import { IsBoolean, IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class FeedbackDto {
  @IsString()
  name: string;

  @IsNumber()
  rating: number;

  @IsString()
  content: string;

  @IsNumber()
  ticketId: number;

  @IsBoolean()
  issueResolved: boolean;
}
