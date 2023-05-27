import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  discordLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  twitterHandle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagramHandle?: string;

  @ApiProperty()
  @IsNumber()
  estimatedPeakPlayerCount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
