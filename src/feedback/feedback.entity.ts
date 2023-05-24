import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../user/user.entity';

@Entity()
@Unique(['ticketId'])
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the feedback.', required: false })
  id: number;

  @Column()
  @IsString()
  @ApiProperty({ description: 'The name of the feedback.', required: true })
  name: string;

  @Column()
  @IsNumber()
  @ApiProperty({ description: 'Rating on a scale of 1-5', required: true })
  rating: number;

  @Column()
  @IsString()
  @ApiProperty({ description: 'Feedback description', required: true })
  content: string;

  @Column()
  @IsNumber()
  @ApiProperty({ description: 'The discord ticket ID', required: true })
  ticketId: number;

  @Column()
  @IsBoolean()
  @ApiProperty({ description: 'Is the issue resolved?', required: true })
  issueResolved: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The ID of the user who made the feedback' })
  userId: number;
  @ApiProperty({
    description: 'The user that owns the feedback.',
    required: true,
    type: () => UserEntity, // use a lazy resolver here
  })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
