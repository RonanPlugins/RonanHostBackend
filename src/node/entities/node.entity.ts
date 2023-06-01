import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseEntity } from '../../purchases/entities/purchase.entity';

@Entity()
export class NodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pterodactylId: number;

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.node)
  purchases: PurchaseEntity[];
}
