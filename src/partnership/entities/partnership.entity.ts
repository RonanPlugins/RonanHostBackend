import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PartnershipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'json', nullable: true })
  serverIds: number[];
}
