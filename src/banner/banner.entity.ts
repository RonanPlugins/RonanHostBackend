import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BannerType } from './banner-type.enum';

@Entity()
export class BannerEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the banner.', required: false })
  id: number;

  @Column()
  @IsNumber()
  @ApiProperty({ description: 'Self explanatory smh', required: true })
  minutesBetweenPopup: number;

  @Column()
  @IsString()
  @ApiProperty({ required: true })
  clickUrl: string;

  @Column()
  @IsString()
  @ApiProperty({ required: true })
  text: string;

  @Column()
  @IsBoolean()
  @ApiProperty({ required: true })
  enabled: boolean;

  @Column()
  @IsBoolean()
  @ApiProperty({ required: true })
  allowClose: boolean;

  @Column({ type: 'enum', enum: BannerType, default: BannerType.NOTIFICATION })
  @ApiProperty({ description: 'The type of banner', required: true })
  type: BannerType;
}
