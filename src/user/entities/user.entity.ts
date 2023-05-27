import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { FeedbackEntity } from 'src/feedback/feedback.entity';
import { Partner } from '../../partner/entities/partner.entity';
import { UserRole } from '../role/user-role.enum';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  newsLetter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  pterodactylUserId: string;

  @OneToMany(() => FeedbackEntity, (feedback: FeedbackEntity) => feedback.user)
  feedbacks: FeedbackEntity[];

  @OneToOne(() => Partner, (partner) => partner.user)
  partner: Partner;

  @Column({ nullable: true })
  passwordResetToken: string;
}
