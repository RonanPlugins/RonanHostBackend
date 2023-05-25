import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @ApiProperty({ description: 'The username of the user.', required: true })
  username: string;

  @IsEmail()
  @ApiProperty({ description: 'The email of the user.', required: true })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'The password of the user.', required: true })
  password: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Does the user want news from newsletter?',
    default: false,
  })
  newsLetter: boolean;
}
