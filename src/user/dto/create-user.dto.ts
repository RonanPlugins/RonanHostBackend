import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  username: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty({ required: false })
  avatar: string;

  @ApiProperty({ default: false })
  newsLetter: boolean;

  @ApiProperty({
    required: false,
  })
  @IsString()
  stripeCustomerId: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  pterodactylUserId: string;
}
