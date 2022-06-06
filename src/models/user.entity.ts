import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 125, unique: true })
  email: string;

  @Column({ type: 'smallint', default: 1 })
  role: number;
}
