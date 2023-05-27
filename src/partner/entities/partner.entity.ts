import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  discordLink: string;

  @Column({ nullable: true })
  twitterHandle: string;

  @Column({ nullable: true })
  instagramHandle: string;

  @Column()
  estimatedPeakPlayerCount: number;

  @Column()
  accepted: boolean;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'json', nullable: true })
  serverIds: number[];
}
