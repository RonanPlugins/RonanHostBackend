import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username', 'email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the user.', required: false })
  id: number;

  @Column()
  @IsString()
  @ApiProperty({ description: 'The username of the user.', required: true })
  username: string;

  @Column()
  @IsStrongPassword()
  @ApiProperty({ description: 'The password of the user.', required: true })
  password: string;

  @Column()
  @IsEmail()
  @ApiProperty({ description: 'The email of the user.', required: true })
  email: string;

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
