import { IsBoolean, IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsBoolean()
  newsLetter: boolean;
}
