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
import { UserRole } from '../user-role.enum';

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty({ description: 'The role of the user.', required: true })
  role: UserRole;

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

  @Column({ nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'The Stripe customer ID of the user.',
    required: false,
  })
  stripeCustomerId: string;

  @Column({ nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'The Pterodactyl user ID of the user.',
    required: false,
  })
  pterodactylUserId: string;
}
