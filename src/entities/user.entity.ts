import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ length: 1024 })
  name: string;

  @Column({ length: 1024 })
  dni: string;

  @Column({ length: 1024 })
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt: Date;

  @ManyToOne(() => Role, (role) => role.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  role: Role;
}
