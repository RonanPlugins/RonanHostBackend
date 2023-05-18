import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { BannerType } from './banner-type.enum';

export class BannerDto {
  @IsNumber()
  minutesBetweenPopup: number;

  @IsString()
  clickUrl: string;

  @IsString()
  text: string;

  @IsBoolean()
  enabled: boolean;

  @IsBoolean()
  allowClose: boolean;

  @IsString()
  @IsEnum(BannerType)
  type: BannerType;
}
