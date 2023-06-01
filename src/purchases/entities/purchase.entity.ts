import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { NodeEntity } from '../../node/entities/node.entity';

@Entity()
export class PurchaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  cost: number;

  @Column()
  company: string;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn()
  purchaseDate: Date;

  @Column({ type: 'int' })
  purchaserId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  invoiceAttachment: string;

  @ManyToOne(() => UserEntity, (user) => user.purchases)
  purchaser: UserEntity;

  @ManyToOne(() => NodeEntity, (node) => node.purchases)
  node: NodeEntity;
}
