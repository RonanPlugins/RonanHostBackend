import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReferralEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the banner.', required: false })
  id: number;

  @Column({ unique: true })
  @IsNumber()
  @ApiProperty({ description: 'The token of the referral', required: true })
  token: string;

  @Column()
  @IsNumber()
  @ApiProperty({
    description: 'The total uses of the referral',
    required: true,
  })
  uses: number;

  @Column({
    default: null,
  })
  @IsString()
  @ApiProperty({ description: 'The owner of the referral', required: true })
  owner: string;

  @Column({
    default: null,
  })
  @IsString()
  @ApiProperty({
    description: 'Optional information about this referral',
    required: false,
  })
  additional_info: string;

  @CreateDateColumn()
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The creation date of the user.',
    required: false,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'The update date of the user.', required: false })
  updatedAt: Date;
}
